import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Types } from 'mongoose';
import 'multer'; // Add this import
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserDocument, UserRole } from '../users/schemas/user.schema';
import { UploadMediaDto } from './dto/upload-media.dto';
import { MediaService } from './media.service';

// Extend the Request type to include user property from Passport
interface AuthenticatedRequest extends Request {
  user: UserDocument; // Assuming JwtStrategy attaches the user document
}

@ApiTags('media') // Tag the controller for Swagger
@Controller('media')
@ApiBearerAuth() // Indicate that this controller uses Bearer token auth
@UseGuards(JwtAuthGuard, RolesGuard) // Apply JWT and Roles guards globally
@Roles(UserRole.ADMIN, UserRole.MANAGER)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @ApiOperation({
    summary: 'Upload media (image/video) and link to a donation or task',
  })
  @ApiResponse({
    status: 201,
    description: 'Media successfully uploaded and linked.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input or file format.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden (Insufficient roles).' })
  @ApiConsumes('multipart/form-data') // Specify content type for file upload
  @ApiBody({
    // Describe the request body for Swagger
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The media file (image or video)',
        },
        donationId: {
          type: 'string',
          description: 'ID of the Donation to link to (optional)',
        },
        taskId: {
          type: 'string',
          description: 'ID of the Task to link to (optional)',
        },
      },
      // Specify which properties are required in the body payload
      // For multipart/form-data, 'required' lists the names of the required parts.
      required: ['file'], // Correct: 'required' is an array of strings at this level
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      // Configure Multer FileInterceptor
      storage: diskStorage({
        destination: './uploads', // Directory to save files (create this directory)
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      // Optional: Add file size limits or file type filters here
      // limits: { fileSize: 1024 * 1024 * 10 }, // e.g., 10MB limit
      // fileFilter: (req, file, cb) => {
      //   if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|mp4|mov|avi)$/)) {
      //     return cb(new BadRequestException('Only image and video files are allowed!'), false);
      //   }
      //   cb(null, true);
      // },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadMediaDto: UploadMediaDto, // DTO for other body fields
    @Req() req: AuthenticatedRequest,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }
    // Ensure req.user._id is treated as ObjectId
    const uploadedBy = req.user._id as Types.ObjectId; // Cast to Types.ObjectId
    return this.mediaService.create(file, uploadMediaDto, uploadedBy);
  }

  // Remove or comment out the following placeholder methods:

  // @Get()
  // findAll() {
  //   return this.mediaService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.mediaService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto) {
  //   return this.mediaService.update(+id, updateMediaDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.mediaService.remove(+id);
  // }

  // Add endpoints for retrieving media later, potentially with access control
  // @Get(':id')
  // async getMedia(@Param('id') id: string) { ... } // Needs access control logic
}
