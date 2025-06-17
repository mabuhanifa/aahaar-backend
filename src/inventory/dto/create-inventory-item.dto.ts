import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateInventoryItemDto {
  @ApiProperty({ description: 'Name of the inventory item', example: 'Rice' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Unit of measurement (e.g., kg, liter)',
    example: 'kg',
  })
  @IsNotEmpty()
  @IsString()
  unit: string;

  @ApiProperty({ description: 'Initial stock level', example: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiProperty({ description: 'Threshold for low stock alert', example: 20 })
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
