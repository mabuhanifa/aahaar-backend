import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule for guards
import { NotificationsModule } from '../notifications/notifications.module'; // Import NotificationsModule
import { UsersModule } from '../users/users.module'; // Import UsersModule for RolesGuard and UserRole enum
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import {
  InventoryItem,
  InventoryItemSchema,
} from './schemas/inventory-item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InventoryItem.name, schema: InventoryItemSchema },
    ]),
    AuthModule, // Import AuthModule to use JwtAuthGuard
    UsersModule, // Import UsersModule to use RolesGuard and UserRole enum
    NotificationsModule, // Add NotificationsModule here
  ],
  providers: [InventoryService],
  controllers: [InventoryController],
  exports: [InventoryService], // Export InventoryService so TasksService can use it
})
export class InventoryModule {}
