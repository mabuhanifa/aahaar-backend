import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaymentMethod, PaymentStatus } from '../schemas/payment.schema';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsMongoId()
  donationId: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsNotEmpty()
  @IsString()
  transactionId: string; // Unique ID from the gateway

  @IsNotEmpty() // Status is required when creating internally
  @IsEnum(PaymentStatus)
  status: PaymentStatus; // Add status

  @IsOptional()
  @IsString()
  notes?: string;
}
