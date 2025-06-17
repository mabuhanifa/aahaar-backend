import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'; // Import Logger
import { ConfigService } from '@nestjs/config'; // Import ConfigService
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import Stripe from 'stripe'; // Import Stripe
import {
  Donation,
  DonationDocument,
  DonationStatus,
} from '../donations/schemas/donation.schema'; // Import DonationStatus
import { CreatePaymentDto } from './dto/create-payment.dto';
import {
  Payment,
  PaymentDocument,
  PaymentMethod,
  PaymentStatus,
} from './schemas/payment.schema'; // Import PaymentMethod

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;
  private readonly webhookSecret: string;
  private readonly logger = new Logger(PaymentsService.name); // Add logger

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(Donation.name) private donationModel: Model<DonationDocument>,
    private configService: ConfigService, // Inject ConfigService
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('stripe.secretKey') as string, // Add type assertion
      {
        apiVersion: '2025-05-28.basil' as Stripe.LatestApiVersion, // Correct type assertion
      },
    );
    this.webhookSecret = this.configService.get<string>(
      'stripe.webhookSecret',
    ) as string; // Add type assertion
  }

  // Method to create a pending payment record (used internally)
  async create(createPaymentDto: CreatePaymentDto): Promise<PaymentDocument> {
    const createdPayment = new this.paymentModel(createPaymentDto);
    const savedPayment = await createdPayment.save();

    // Link the payment to the donation
    await this.donationModel
      .findByIdAndUpdate(
        createPaymentDto.donationId,
        { payment: (savedPayment as PaymentDocument & Document)._id }, // Cast savedPayment
        { new: true },
      )
      .exec();

    return savedPayment;
  }

  async updateStatus(
    transactionId: string,
    status: PaymentStatus,
  ): Promise<PaymentDocument | null> {
    const payment = await this.paymentModel.findOne({ transactionId }).exec();

    if (!payment) {
      throw new NotFoundException(
        `Payment with transaction ID "${transactionId}" not found.`,
      );
    }

    payment.status = status;
    return payment.save();
  }

  // Add methods for finding payments, etc.
  async findOneByTransactionId(
    transactionId: string,
  ): Promise<PaymentDocument | null> {
    return this.paymentModel.findOne({ transactionId }).exec();
  }

  async findByDonationId(donationId: string): Promise<PaymentDocument | null> {
    return this.paymentModel.findOne({ donation: donationId }).exec();
  }

  // --- Stripe Specific Methods ---

  async createPaymentIntent(
    donationId: string,
    amount: number,
  ): Promise<Stripe.PaymentIntent> {
    // Amount in smallest currency unit (e.g., cents for USD, paise for INR)
    // Assuming amount is in major unit (e.g., INR), convert to paise
    const amountInSmallestUnit = Math.round(amount * 100); // Adjust based on currency

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amountInSmallestUnit,
        currency: 'inr', // Use your currency code
        metadata: { donationId: donationId }, // Link to your donation ID
        // Add other options like description, receipt_email, etc.
      });

      // Create a pending payment record in your database
      await this.create({
        donationId: donationId,
        amount: amount, // Store amount in major unit
        method: PaymentMethod.STRIPE,
        transactionId: paymentIntent.id, // Use Stripe Payment Intent ID as transaction ID
        status: PaymentStatus.PENDING,
        notes: `Stripe Payment Intent created: ${paymentIntent.id}`,
      });

      return paymentIntent;
    } catch (error) {
      this.logger.error(
        `Failed to create Stripe Payment Intent for donation ${donationId}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to initiate payment: ${error.message}`,
      );
    }
  }

  async handleWebhookEvent(rawBody: Buffer, signature: string): Promise<void> {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        this.webhookSecret,
      );
    } catch (err) {
      this.logger.error(
        `Webhook signature verification failed: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntentSucceeded = event.data
          .object as Stripe.PaymentIntent;
        this.logger.log(
          `PaymentIntent was successful: ${paymentIntentSucceeded.id}`,
        );
        // Update payment status to COMPLETED
        await this.updateStatus(
          paymentIntentSucceeded.id,
          PaymentStatus.COMPLETED,
        );
        // TODO: Update Donation status to reflect payment completion
        // You might need to fetch the donation using paymentIntentSucceeded.metadata.donationId
        // and update its status (e.g., from PENDING to IN_PROGRESS or FULFILLED depending on your flow)
        const donationId = paymentIntentSucceeded.metadata.donationId;
        if (donationId) {
          await this.donationModel
            .findByIdAndUpdate(donationId, {
              status: DonationStatus.IN_PROGRESS,
            })
            .exec(); // Example status update
          this.logger.log(
            `Updated donation ${donationId} status to IN_PROGRESS.`,
          );
        }
        break;
      case 'payment_intent.payment_failed':
        const paymentIntentFailed = event.data.object as Stripe.PaymentIntent;
        this.logger.error(
          `PaymentIntent failed: ${paymentIntentFailed.id}, Last error: ${paymentIntentFailed.last_payment_error?.message}`,
        );
        // Update payment status to FAILED
        await this.updateStatus(paymentIntentFailed.id, PaymentStatus.FAILED);
        // TODO: Update Donation status to reflect payment failure
        const failedDonationId = paymentIntentFailed.metadata.donationId;
        if (failedDonationId) {
          await this.donationModel
            .findByIdAndUpdate(failedDonationId, {
              status: DonationStatus.CANCELLED,
            })
            .exec(); // Example status update
          this.logger.log(
            `Updated donation ${failedDonationId} status to CANCELLED.`,
          );
        }
        break;
      // Handle other event types as needed
      default:
        this.logger.warn(`Unhandled event type ${event.type}`);
    }
  }
}
