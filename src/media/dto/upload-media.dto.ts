import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional } from 'class-validator';

export class UploadMediaDto {
  @ApiProperty({
    description: 'ID of the Donation to link the media to (optional)',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  donationId?: string;

  @ApiProperty({
    description: 'ID of the Task to link the media to (optional)',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  taskId?: string;

  // Note: The file itself is handled by Multer, not part of the DTO body validation
}
