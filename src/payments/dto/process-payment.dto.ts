import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaymentMethod, PaymentStatus } from '../schemas/payment.schema';

export class ProcessPaymentDto {
  @ApiProperty({
    description: 'ID of the associated Donation',
    example: '60f7b3b3b3b3b3b3b3b3b3b3',
  })
  @IsNotEmpty()
  @IsString() // Use string for ObjectId in DTO
  donationId: string;

  @ApiProperty({ description: 'Amount paid', example: 100 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    enum: PaymentMethod,
    description: 'Payment method used',
    example: PaymentMethod.MOCKED,
  })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty({
    description: 'Unique transaction ID from the payment gateway',
    example: 'txn_1234567890abcdef',
  })
  @IsNotEmpty()
  @IsString()
  transactionId: string;

  @ApiProperty({
    enum: PaymentStatus,
    description: 'Final status of the payment',
    example: PaymentStatus.COMPLETED,
  })
  @IsNotEmpty()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiProperty({
    description: 'Optional notes from the gateway',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
