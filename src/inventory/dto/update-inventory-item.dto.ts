import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateInventoryItemDto {
  @ApiProperty({
    description: 'Name of the inventory item',
    example: 'Rice',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Unit of measurement (e.g., kg, liter)',
    example: 'kg',
    required: false,
  })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty({
    description: 'Current stock level',
    example: 80,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiProperty({
    description: 'Threshold for low stock alert',
    example: 15,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  lowStockThreshold?: number;

  @ApiProperty({
    description: 'Optional notes about the item',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
