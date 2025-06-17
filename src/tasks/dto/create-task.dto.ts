import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty
import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { TaskType } from '../schemas/task.schema';

export class CreateTaskDto {
  @ApiProperty({ enum: TaskType, description: 'Type of task' })
  @IsEnum(TaskType)
  type: TaskType;

  @ApiProperty({
    description: 'ID of the associated Donation',
    example: '60f7b3b3b3b3b3b3b3b3b3b3',
  })
  @IsMongoId()
  donation: string;

  @ApiProperty({
    description: 'Optional ID of the staff assigned to the task',
    required: false,
    example: '60f7b3b3b3b3b3b3b3b3b3b3',
  })
  @IsOptional()
  @IsMongoId()
  assignedStaff?: string;

  @ApiProperty({
    description: 'Optional ID of the location for this task',
    required: false,
    example: '60f7b3b3b3b3b3b3b3b3b3b3',
  })
  @IsOptional()
  @IsMongoId()
  locationId?: string; // Add locationId

  @ApiProperty({
    description: 'Optional notes about the task',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
