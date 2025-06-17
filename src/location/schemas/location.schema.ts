import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LocationDocument = Location & Document;

@Schema({ timestamps: true })
export class Location {
  @Prop({ required: true })
  district: string;

  @Prop()
  upazila?: string; // Sub-district

  @Prop()
  village?: string;

  @Prop({ required: true }) // Remove unique: true here
  name: string; // A combined or specific name for the area

  @Prop()
  notes?: string;
}

export const LocationSchema = SchemaFactory.createForClass(Location);

// Add indexes for faster lookups
LocationSchema.index({ district: 1 });
LocationSchema.index({ name: 1 }, { unique: true }); // Keep the unique index definition here
