import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // Import MongooseModule
import { User, UserSchema } from '../users/schemas/user.schema'; // Import User schema
import { UsersModule } from '../users/users.module';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Register User schema for NotificationsService
  ],
  providers: [NotificationsService],
  // No controllers needed for a service-only module
  exports: [NotificationsService],
})
export class NotificationsModule {}
