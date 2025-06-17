import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateLocationDto {
  @ApiProperty({
    description: 'District name (optional)',
    required: false,
    example: 'Dhaka',
  })
  @IsOptional()
  @IsString()
  district?: string;

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
    description: 'A specific name for the location area (optional)',
    required: false,
    example: 'Gulshan 1 Area',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Optional notes about the location',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
