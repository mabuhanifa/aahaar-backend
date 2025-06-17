import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { NotificationType } from '../notifications/enums/notification-type.enum';
import { NotificationsService } from '../notifications/notifications.service';
import { PaymentsService } from '../payments/payments.service';
import { UserDocument } from '../users/schemas/user.schema';
import { CreateDonationDto } from './dto/create-donation.dto';
import {
  Donation,
  DonationDocument,
  DonationStatus,
} from './schemas/donation.schema';

@Injectable()
export class DonationsService {
  constructor(
    @InjectModel(Donation.name) private donationModel: Model<DonationDocument>,
    private notificationsService: NotificationsService,
    private paymentsService: PaymentsService,
  ) {}

  async create(
    createDonationDto: CreateDonationDto,
    user?: UserDocument,
  ): Promise<DonationDocument> {
    const donationData: any = {
      type: createDonationDto.type,
      amount: createDonationDto.amount,
      notes: createDonationDto.notes,
      status: DonationStatus.PENDING, // Initial status is PENDING until payment is confirmed
      location: createDonationDto.locationId
        ? new Types.ObjectId(createDonationDto.locationId)
        : undefined,
    };

    let recipient: UserDocument | { email?: string; id?: string };

    if (user) {
      // Authenticated donation
      donationData.donor = user._id;
      recipient = user;
    } else {
      // Anonymous donation
      donationData.anonymousDonorEmail = createDonationDto.anonymousDonorEmail;
      donationData.anonymousReferenceId = uuidv4();
      recipient = { email: createDonationDto.anonymousDonorEmail };
    }

    const createdDonation = new this.donationModel(donationData);
    const savedDonation = await createdDonation.save();

    // Initiate Stripe Payment Intent after saving the donation
    try {
      // The createPaymentIntent method in PaymentsService will also create the pending Payment record
      await this.paymentsService.createPaymentIntent(
        (savedDonation as any)._id.toString(), // Pass donation ID
        savedDonation.amount, // Pass donation amount
      );
      // The Payment Intent ID will be stored as the transactionId in the Payment schema
      // The Payment record will be linked to the Donation in paymentsService.create
    } catch (error) {
      console.error(
        `Failed to initiate Stripe Payment Intent for donation ${(savedDonation as any)._id}: ${error.message}`,
      );
      // Decide how to handle this error: mark donation as failed, delete donation?
      // For now, just log and continue, but the donation status remains PENDING
      // You might want to update the donation status to FAILED_PAYMENT here
      await this.donationModel
        .findByIdAndUpdate((savedDonation as any)._id, {
          status: DonationStatus.CANCELLED,
        })
        .exec(); // Example: Mark as cancelled on payment initiation failure
    }

    // Trigger notification for donation received (optional, might wait for payment success)
    // Depending on flow, you might send this notification *after* payment is successful
    if (recipient) {
      this.notificationsService.sendNotification(
        NotificationType.DONATION_RECEIVED,
        recipient,
        {
          donationId: (savedDonation as any)._id.toString(),
          amount: savedDonation.amount,
          type: savedDonation.type,
          referenceId: savedDonation.anonymousReferenceId,
        },
      );
    }

    return savedDonation;
  }

  // ...existing methods...
}
