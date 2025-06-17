import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose'; // Import Document
import 'multer'; // Add this import
import {
  Donation,
  DonationDocument,
} from '../donations/schemas/donation.schema';
import { NotificationType } from '../notifications/enums/notification-type.enum';
import { NotificationsService } from '../notifications/notifications.service';
import { Task, TaskDocument } from '../tasks/schemas/task.schema';
import { UserDocument, UserRole } from '../users/schemas/user.schema';
import { UploadMediaDto } from './dto/upload-media.dto';
import { Media, MediaDocument, MediaType } from './schemas/media.schema';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Media.name) private mediaModel: Model<MediaDocument>,
    @InjectModel(Donation.name) private donationModel: Model<DonationDocument>,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    private notificationsService: NotificationsService,
  ) {}

  async create(
    file: Express.Multer.File,
    uploadMediaDto: UploadMediaDto,
    uploadedBy: Types.ObjectId,
  ): Promise<MediaDocument> {
    const { donationId, taskId } = uploadMediaDto;

    if (!donationId && !taskId) {
      throw new BadRequestException(
        'Either donationId or taskId must be provided.',
      );
    }
    if (donationId && taskId) {
      throw new BadRequestException(
        'Cannot link media to both a donation and a task.',
      );
    }

    // Determine media type based on mimetype
    let mediaType = MediaType.OTHER;
    if (file.mimetype.startsWith('image/')) {
      mediaType = MediaType.IMAGE;
    } else if (file.mimetype.startsWith('video/')) {
      mediaType = MediaType.VIDEO;
    }

    const createdMedia = new this.mediaModel({
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      type: mediaType,
      donation: donationId ? new Types.ObjectId(donationId) : undefined,
      task: taskId ? new Types.ObjectId(taskId) : undefined,
      uploadedBy: uploadedBy,
    });

    const savedMedia = await createdMedia.save();

    // Link the media to the parent document (Donation or Task)
    let parentDocument: DonationDocument | TaskDocument | null = null;
    if (donationId) {
      parentDocument = await this.donationModel
        .findByIdAndUpdate(
          donationId,
          { $push: { media: (savedMedia as any)._id } },
          { new: true },
        )
        .exec(); // Cast savedMedia to any
    } else if (taskId) {
      parentDocument = await this.taskModel
        .findByIdAndUpdate(
          taskId,
          { $push: { media: (savedMedia as any)._id } },
          { new: true },
        )
        .exec(); // Cast savedMedia to any
    }

    if (!parentDocument) {
      console.error(
        `Failed to find parent document for media ${(savedMedia as any)._id}`, // Cast savedMedia to any
      );
    } else {
      // Trigger notification for proof uploaded
      // Determine recipient: Donor for donation media, maybe admin/manager for task media?
      let recipient:
        | UserDocument
        | { email?: string; id?: string }
        | { roles: UserRole[] }
        | undefined;

      if (donationId) {
        const donation = parentDocument as DonationDocument;
        // Check if donor is populated (is an object) or just an ObjectId
        if (donation.donor) {
          // Use type guard to check if donor is a populated object
          const donorId = (donation.donor as any)._id
            ? (donation.donor as any)._id.toString()
            : (donation.donor as Types.ObjectId).toString(); // Safely access _id
          recipient = { id: donorId }; // Notify authenticated donor by ID
        } else if (donation.anonymousDonorEmail) {
          recipient = { email: donation.anonymousDonorEmail }; // Notify anonymous donor by email
        }
      } else if (taskId) {
        // For task media, notify relevant staff (manager/admin)
        recipient = { roles: [UserRole.ADMIN, UserRole.MANAGER] };
      }

      if (recipient) {
        this.notificationsService.sendNotification(
          NotificationType.PROOF_UPLOADED,
          recipient,
          {
            mediaId: (savedMedia as any)._id.toString(), // Cast savedMedia to any
            donationId: (savedMedia as any).donation?.toString(), // Cast savedMedia to any
            taskId: (savedMedia as any).task?.toString(), // Cast savedMedia to any
            uploadedBy: (savedMedia as any).uploadedBy?.toString(), // Cast savedMedia to any
          },
        );
      }
    }

    return savedMedia;
  }

  // Add methods for retrieving media, potentially with access control checks
  // async findById(id: string): Promise<MediaDocument | null> { ... }
  // async findByDonationId(donationId: string): Promise<MediaDocument[]> { ... }
  // async findByTaskId(taskId: string): Promise<MediaDocument[]> { ... }
}
