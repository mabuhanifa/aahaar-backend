import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'; // Import NotFoundException, BadRequestException
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express'; // Import Request type
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InitiatePaymentDto } from './dto/initiate-payment.dto'; // Import InitiatePaymentDto
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { PaymentsService } from './payments.service';

// Extend the Request type to include rawBody property (added by middleware)
interface RawBodyRequest extends Request {
  rawBody: Buffer;
}

@ApiTags('payments')
@Controller('payments')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RolesGuard) // Payment processing might be public or require specific roles
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // Endpoint to initiate a payment (create Payment Intent)
  @Post('initiate')
  @ApiOperation({
    summary:
      'Initiate a payment for a donation (creates Stripe Payment Intent)',
  })
  @ApiResponse({
    status: 201,
    description: 'Payment Intent created.',
    schema: { example: { clientSecret: '...', id: '...' } },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or failed to create Payment Intent.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  // Decide if this endpoint requires authentication (for logged-in donors)
  // If anonymous donations are allowed, this might be public or have different auth logic
  @UseGuards(JwtAuthGuard) // Example: Requires authentication
  async initiatePayment(@Body() initiatePaymentDto: InitiatePaymentDto) {
    // In a real app, you'd fetch the donation details (especially amount) using donationId
    // For simplicity, let's assume the donation exists and get its amount
    const donation = await this.paymentsService['donationModel']
      .findById(initiatePaymentDto.donationId)
      .exec(); // Access donationModel from service (less ideal, better to have a DonationService method)
    if (!donation) {
      throw new NotFoundException(
        `Donation with ID "${initiatePaymentDto.donationId}" not found.`,
      );
    }

    // Create the Stripe Payment Intent
    const paymentIntent = await this.paymentsService.createPaymentIntent(
      initiatePaymentDto.donationId,
      donation.amount, // Use the amount from the donation
    );

    // Return the client secret and Payment Intent ID to the frontend
    return {
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    };
  }

  // Stripe Webhook Endpoint
  // This endpoint must be public and receive the raw request body
  @Post('webhook')
  @HttpCode(HttpStatus.OK) // Return 200 OK on success
  @ApiOperation({
    summary: 'Stripe webhook endpoint (receives payment events)',
  })
  @ApiResponse({ status: 200, description: 'Webhook received and processed.' })
  @ApiResponse({ status: 400, description: 'Invalid request or signature.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async handleStripeWebhook(
    @Req() req: RawBodyRequest,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    // The raw body is needed for signature verification
    const rawBody = req.rawBody;

    try {
      await this.paymentsService.handleWebhookEvent(rawBody, signature);
      return { received: true }; // Acknowledge receipt
    } catch (error) {
      // Log the error and return a non-200 status to Stripe if verification fails
      // Stripe will retry webhooks that don't return 200
      // However, if verification fails, we should return 400
      if (error instanceof BadRequestException) {
        throw error; // Re-throw BadRequestException for signature errors
      }
      // For other errors during processing, log and return 500
      console.error('Error processing Stripe webhook:', error);
      throw new Error('Internal server error'); // Throw a generic error for other issues
    }
  }

  // This is a mocked endpoint to simulate a payment gateway callback
  // In a real application, this would be a webhook endpoint
  @Post('process-mocked')
  @ApiOperation({
    summary: 'Process a mocked payment (simulates gateway callback)',
  })
  @ApiResponse({ status: 200, description: 'Payment status updated.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 404, description: 'Payment not found.' })
  // This endpoint might need specific security (e.g., webhook secret validation)
  // For now, let's allow it without guards for simplicity in mocking
  async processMockedPayment(@Body() processPaymentDto: ProcessPaymentDto) {
    // In a real scenario, you'd verify the request signature from the gateway
    // and then update the payment status based on the gateway's data.
    // Here, we directly use the DTO to update the status.
    return this.paymentsService.updateStatus(
      processPaymentDto.transactionId,
      processPaymentDto.status,
    );
  }

  // TODO: Add endpoints for initiating payments (e.g., /payments/initiate)
  // This would involve creating a payment intent with Stripe/PayPal and returning client secrets/redirect URLs.
  // @Post('initiate')
  // @UseGuards(JwtAuthGuard) // Or public for anonymous payments
  // @ApiOperation({ summary: 'Initiate a payment for a donation' })
  // async initiatePayment(@Body() initiatePaymentDto: InitiatePaymentDto, @Req() req: AuthenticatedRequest) {
  //    // Logic to create payment intent with gateway
  //    // Link the pending payment record to the donation
  //    // Return gateway details to the client
  // }
}
