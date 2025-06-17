import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({ description: 'District name', example: 'Dhaka' })
  @IsNotEmpty()
  @IsString()
  district: string;

  @ApiProperty({
    description: 'Upazila (sub-district) name (optional)',
    required: false,
    example: 'Gulshan',
  })
  @IsOptional()
  @IsString()
  upazila?: string;

  @ApiProperty({
    description: 'Village name (optional)',
    required: false,
    example: 'Banani',
  })
  @IsOptional()
  @IsString()
  village?: string;

  @ApiProperty({
    description: 'A specific name for the location area',
    example: 'Gulshan 1 Area',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Optional notes about the location',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
