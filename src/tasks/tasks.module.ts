import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryModule } from '../inventory/inventory.module'; // Import InventoryModule
import { NotificationsModule } from '../notifications/notifications.module'; // Import NotificationsModule
import { Task, TaskSchema } from './schemas/task.schema';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    InventoryModule, // Import InventoryModule
    NotificationsModule, // Import NotificationsModule
  ],
  providers: [TasksService],
  controllers: [TasksController],
  // exports: [TasksService], // Export if other modules need to interact with TasksService
})
export class TasksModule {}
