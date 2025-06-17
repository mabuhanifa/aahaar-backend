import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Location } from '../../location/schemas/location.schema'; // Import Location schema
import { Media } from '../../media/schemas/media.schema';

export type TaskDocument = Task & Document;

export enum TaskType {
  PREPARE_FOOD = 'prepare_food',
  DELIVER_RATION = 'deliver_ration',
  RECORD_MEDIA = 'record_media',
}

export enum TaskStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true, enum: TaskType })
  type: TaskType;

  @Prop({ required: true, enum: TaskStatus, default: TaskStatus.NOT_STARTED })
  status: TaskStatus;

  @Prop({ type: Types.ObjectId, ref: 'Donation', required: true })
  donation: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  assignedStaff?: Types.ObjectId;

  @Prop({ default: false })
  autoAssigned: boolean;

  @Prop()
  notes?: string;

  // Add field for linked media
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Media' }], default: [] })
  media: Types.ObjectId[] | Media[];

  // Add field for location
  @Prop({ type: Types.ObjectId, ref: 'Location', required: false }) // Location is optional
  location?: Types.ObjectId | Location;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

// ...existing indexes...
TaskSchema.index({ location: 1 }); // Add index for location
