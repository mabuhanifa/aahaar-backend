import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule for guards
import { Donation, DonationSchema } from '../donations/schemas/donation.schema'; // Import Donation schema
import { NotificationsModule } from '../notifications/notifications.module'; // Import NotificationsModule
import { Task, TaskSchema } from '../tasks/schemas/task.schema'; // Import Task schema
import { UsersModule } from '../users/users.module'; // Import UsersModule if needed (e.g., for user roles)
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { Media, MediaSchema } from './schemas/media.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Media.name, schema: MediaSchema },
      { name: Donation.name, schema: DonationSchema }, // Register Donation schema
      { name: Task.name, schema: TaskSchema }, // Register Task schema
    ]),
    AuthModule, // Import AuthModule to use JwtAuthGuard
    UsersModule, // Import UsersModule to use RolesGuard and UserRole enum
    NotificationsModule, // Import NotificationsModule
  ],
  providers: [MediaService],
  controllers: [MediaController],
  // exports: [MediaService], // Export if other modules need to interact with MediaService
})
export class MediaModule {}
