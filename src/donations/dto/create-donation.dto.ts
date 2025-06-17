import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { DonationType } from '../schemas/donation.schema';

export class CreateDonationDto {
  @ApiProperty({ enum: DonationType, description: 'Type of donation' })
  @IsNotEmpty()
  @IsEnum(DonationType)
  type: DonationType;

  @ApiProperty({ description: 'Amount of donation', example: 100 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1) // Minimum donation amount
  amount: number;

  @ApiProperty({
    description: 'Optional ID of the location for this donation',
    required: false,
    example: '60f7b3b3b3b3b3b3b3b3b3b3',
  })
  @IsOptional()
  @IsMongoId()
  locationId?: string;

  // Optional fields for anonymous donations
  @ApiProperty({
    description: 'Email for anonymous donor (optional)',
    required: false,
    example: 'anonymous@example.com',
  })
  @IsOptional()
  @IsString()
  anonymousDonorEmail?: string;

  @ApiProperty({
    description: 'Optional notes from the donor',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  // Note: donor ID and status will be set by the service/controller, not the DTO
}
