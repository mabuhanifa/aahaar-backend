import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'; // Import InjectModel
import { Model } from 'mongoose'; // Import Model
import { User, UserDocument, UserRole } from '../users/schemas/user.schema'; // Import UserRole
import { NotificationType } from './enums/notification-type.enum';

// Define a more flexible recipient type
type NotificationRecipient =
  | UserDocument
  | { email?: string; id?: string }
  | { roles: UserRole[] };

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>, // Inject User model to find users by role
  ) {}

  // This method will handle sending notifications via different channels
  // It should eventually check user preferences and queue messages
  async sendNotification(
    type: NotificationType,
    recipient: NotificationRecipient, // Use the new flexible type
    data: any, // Data relevant to the notification
  ): Promise<void> {
    let recipientInfo = 'Unknown Recipient';
    let targetUsers: UserDocument[] = [];

    if (recipient instanceof this.userModel) {
      // Check if it's a Mongoose User document
      recipientInfo = `${recipient.email || recipient._id}`;
      targetUsers = [recipient];
    } else if ('email' in recipient && recipient.email) {
      recipientInfo = `Email: ${recipient.email}`;
      // TODO: Find user by email if needed for preferences, or just use email
      // For now, we'll just log the email
      // targetUsers = await this.userModel.find({ email: recipient.email }).exec();
    } else if ('id' in recipient && recipient.id) {
      recipientInfo = `User ID: ${recipient.id}`;
      targetUsers = await this.userModel
        .findById(recipient.id)
        .exec()
        .then((user) => (user ? [user] : []));
    } else if ('roles' in recipient && Array.isArray(recipient.roles)) {
      recipientInfo = `Roles: ${recipient.roles.join(', ')}`;
      targetUsers = await this.userModel
        .find({ roles: { $in: recipient.roles } })
        .exec();
    }

    if (
      targetUsers.length === 0 &&
      !('email' in recipient && recipient.email)
    ) {
      this.logger.warn(
        `No users found for notification "${type}" to recipient: ${recipientInfo}`,
      );
      return; // Don't send if no recipients found (unless it's an email-only notification)
    }

    this.logger.log(
      `Attempting to send notification "${type}" to ${recipientInfo} (${targetUsers.length} users) with data: ${JSON.stringify(data)}`,
    );

    // TODO: Implement actual sending logic (email, WhatsApp) for each targetUser or email
    // TODO: Implement user preference checks for each targetUser
    // TODO: Implement queuing mechanism for async sending
    switch (type) {
      case NotificationType.DONATION_RECEIVED:
        this.logger.log(
          `[Notification: Donation Received] To: ${recipientInfo}, Donation ID: ${data.donationId}, Amount: ${data.amount}`,
        );
        // Example: Send email to donor (targetUsers or recipient.email)
        break;
      case NotificationType.PROOF_UPLOADED:
        this.logger.log(
          `[Notification: Proof Uploaded] To: ${recipientInfo}, Donation ID: ${data.donationId}, Task ID: ${data.taskId}, Media ID: ${data.mediaId}`,
        );
        // Example: Send email to donor (if linked to donation) or admin/manager (if linked to task)
        break;
      case NotificationType.TASK_COMPLETED:
        this.logger.log(
          `[Notification: Task Completed] To: ${recipientInfo}, Task ID: ${data.taskId}, Task Type: ${data.taskType}`,
        );
        // Example: Send email to manager/admin (targetUsers)
        break;
      case NotificationType.LOW_INVENTORY:
        this.logger.log(
          `[Notification: Low Inventory] To: ${recipientInfo}, Item: ${data.itemName}, Stock: ${data.stock}, Threshold: ${data.threshold}.`,
        );
        // Example: Send email/WhatsApp to manager/admin (targetUsers)
        break;
      default:
        this.logger.warn(`Unknown notification type: ${type}`);
    }
  }

  // TODO: Add methods for managing user notification preferences
  // async getUserPreferences(userId: string): Promise<NotificationPreferences> { ... }
  // async updateUserPreferences(userId: string, preferences: NotificationPreferencesDto): Promise<UserDocument> { ... }
}
