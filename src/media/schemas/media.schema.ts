import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MediaDocument = Media & Document;

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  OTHER = 'other',
}

@Schema({ timestamps: true })
export class Media {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  mimetype: string;

  @Prop({ required: true })
  size: number; // in bytes

  @Prop({ required: true })
  path: string; // Local path or cloud storage URL

  @Prop({ required: true, enum: MediaType })
  type: MediaType;

  // Link to either a Donation or a Task
  @Prop({ type: Types.ObjectId, ref: 'Donation', required: false })
  donation?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Task', required: false })
  task?: Types.ObjectId;

  // Optional: Link to the user who uploaded the media
  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  uploadedBy?: Types.ObjectId;
}

export const MediaSchema = SchemaFactory.createForClass(Media);

// Add indexes for faster lookups
MediaSchema.index({ donation: 1 });
MediaSchema.index({ task: 1 });
MediaSchema.index({ uploadedBy: 1 });
