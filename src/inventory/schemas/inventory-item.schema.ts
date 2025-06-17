import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InventoryItemDocument = InventoryItem & Document;

@Schema({ timestamps: true })
export class InventoryItem {
  @Prop({ required: true }) // Remove unique: true here
  name: string; // e.g., Rice, Lentils, Cooking Oil

  @Prop({ required: true })
  unit: string; // e.g., kg, liter, piece

  @Prop({ required: true, default: 0 })
  stock: number; // Current stock level

  @Prop({ required: true, default: 10 }) // Example threshold
  lowStockThreshold: number;

  @Prop()
  notes?: string;
}

export const InventoryItemSchema = SchemaFactory.createForClass(InventoryItem);

// Add index for faster lookups
InventoryItemSchema.index({ name: 1 }, { unique: true }); // Keep the unique index definition here
