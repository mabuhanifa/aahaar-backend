import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentDocument = Payment & Document;

export enum PaymentMethod {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  MOCKED = 'mocked', // For testing/placeholder
  // Add other methods as needed
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'Donation', required: true })
  donation: Types.ObjectId;

  @Prop({ required: true })
  amount: number; // Amount paid

  @Prop({ required: true, enum: PaymentMethod })
  method: PaymentMethod;

  @Prop({ required: true, enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Prop({ required: true }) // Remove unique: true here
  transactionId: string; // Unique ID from the payment gateway

  @Prop()
  notes?: string; // Optional notes from the gateway or system

  // Optional: Store more details from the payment gateway response
  // @Prop({ type: Object })
  // gatewayResponse?: any;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

// Add indexes for faster lookups
PaymentSchema.index({ donation: 1 });
PaymentSchema.index({ transactionId: 1 }, { unique: true }); // Keep the unique index definition here
PaymentSchema.index({ status: 1 });
