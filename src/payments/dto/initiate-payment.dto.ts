import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class InitiatePaymentDto {
  @ApiProperty({
    description: 'ID of the associated Donation',
    example: '60f7b3b3b3b3b3b3b3b3b3b3',
  })
  @IsNotEmpty()
  @IsMongoId()
  donationId: string;

  // Amount is typically taken from the Donation itself, but can be included here if needed
  // @ApiProperty({ description: 'Amount to pay', example: 100 })
  // @IsNotEmpty()
  // @IsNumber()
  // @Min(1)
  // amount: number;
}
