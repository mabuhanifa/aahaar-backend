import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator'; // Import IsOptional, IsMongoId

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  }) // Describe property
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (min 6 characters)',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6) // Example minimum length
  password: string;

  @ApiProperty({
    description: 'Optional ID of the location assigned to the user (for staff)',
    required: false,
    example: '60f7b3b3b3b3b3b3b3b3b3b3',
  })
  @IsOptional()
  @IsMongoId()
  assignedLocationId?: string; // Add assignedLocationId

  // Optional fields, can be added based on requirements
  // @IsOptional()
  // @IsString()
  // name?: string;

  // Roles might be set by admin later, or default to DONOR
  // @IsOptional()
  // @IsArray()
  // @IsEnum(UserRole, { each: true })
  // roles?: UserRole[];
}
