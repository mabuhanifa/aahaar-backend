import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Location } from '../../location/schemas/location.schema'; // Import Location schema
import { Media } from '../../media/schemas/media.schema'; // Import Media schema
import { Payment } from '../../payments/schemas/payment.schema'; // Import Payment schema
import { User } from '../../users/schemas/user.schema'; // Import User schema

export type DonationDocument = Donation & Document;

export enum DonationType {
  FEEDING_PEOPLE = 'feeding_people',
  GIVING_RATION = 'giving_ration',
  RANDOM_AMOUNT = 'random_amount',
}

export enum DonationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  FULFILLED = 'fulfilled',
  VERIFIED = 'verified',
  CANCELLED = 'cancelled', // Added cancelled status
}

@Schema({ timestamps: true }) // Add timestamps for createdAt and updatedAt
export class Donation {
  @Prop({ required: true, enum: DonationType })
  type: DonationType;

  @Prop({ required: true })
  amount: number; // Amount in currency (e.g., INR)

  @Prop({
    required: true,
    enum: DonationStatus,
    default: DonationStatus.PENDING,
  })
  status: DonationStatus;

  // Optional: Reference to the authenticated user
  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  donor?: Types.ObjectId | User;

  // Fields for anonymous donations
  @Prop({ required: false })
  anonymousDonorEmail?: string;

  @Prop({ required: false }) // Remove unique: true and sparse: true here
  anonymousReferenceId?: string; // Unique ID for anonymous donors to track proof

  // Optional notes or message from donor
  @Prop()
  notes?: string;

  // Add fields for proof later (e.g., media links)
  // @Prop({ type: [String] })
  // proofMediaUrls?: string[];

  // Add field for linked media
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Media' }], default: [] })
  media: Types.ObjectId[] | Media[];

  // Add field for linked payment
  @Prop({ type: Types.ObjectId, ref: 'Payment', required: false }) // Payment is optional initially
  payment?: Types.ObjectId | Payment;

  // Add field for location
  @Prop({ type: Types.ObjectId, ref: 'Location', required: false }) // Location is optional
  location?: Types.ObjectId | Location;
}

export const DonationSchema = SchemaFactory.createForClass(Donation);

// Optional: Add index for faster lookups
DonationSchema.index({ donor: 1 });
DonationSchema.index(
  { anonymousReferenceId: 1 },
  { unique: true, sparse: true },
); // Keep the index definition here
DonationSchema.index({ status: 1 });
DonationSchema.index({ type: 1 });
DonationSchema.index({ payment: 1 }); // Add index for payment
DonationSchema.index({ location: 1 }); // Add index for location
