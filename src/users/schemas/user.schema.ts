import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Document, Types } from 'mongoose';
import { Location } from '../../location/schemas/location.schema'; // Import Location schema

export type UserDocument = User & Document;

export enum UserRole {
  DONOR = 'donor',
  ADMIN = 'admin',
  COOK = 'cook',
  MANAGER = 'manager',
  VOLUNTEER = 'volunteer',
}

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string; // Hashed password

  @Prop({ type: [String], enum: UserRole, default: [UserRole.DONOR] })
  roles: UserRole[];

  // Add other user properties as needed (e.g., name, phone, address)
  @Prop()
  name?: string;

  @Prop()
  googleId?: string; // For Google OAuth

  // Add field for staff location/region
  @Prop({ type: Types.ObjectId, ref: 'Location', required: false }) // Optional, mainly for staff
  assignedLocation?: Types.ObjectId | Location;

  // Method to compare passwords
  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

// Pre-save hook to hash password before saving
UserSchema.pre<UserDocument>('save', async function (next) {
  if (this.isModified('password')) {
    const saltRounds = 10; // Or get from config
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});
