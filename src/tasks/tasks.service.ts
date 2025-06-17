import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { InventoryService } from '../inventory/inventory.service';
import { NotificationType } from '../notifications/enums/notification-type.enum';
import { NotificationsService } from '../notifications/notifications.service';
import { UserRole } from '../users/schemas/user.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import {
  Task,
  TaskDocument,
  TaskStatus,
  TaskType,
} from './schemas/task.schema';

// Define inventory requirements per task type (basic example)
const TASK_INVENTORY_REQUIREMENTS: {
  [key in TaskType]?: { itemName: string; quantity: number }[];
} = {
  [TaskType.PREPARE_FOOD]: [
    { itemName: 'Rice', quantity: 1 }, // Example: 1kg rice per food prep task
    { itemName: 'Lentils', quantity: 0.5 }, // Example: 0.5kg lentils
    // Add other ingredients...
  ],
  [TaskType.DELIVER_RATION]: [
    { itemName: 'Ration Pack', quantity: 1 }, // Example: 1 ration pack per delivery
  ],
  // RECORD_MEDIA tasks don't consume inventory
};

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    private inventoryService: InventoryService,
    private notificationsService: NotificationsService,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<TaskDocument> {
    const createdTask = new this.taskModel({
      ...createTaskDto,
      status: TaskStatus.NOT_STARTED,
      autoAssigned: !createTaskDto.assignedStaff,
      location: createTaskDto.locationId
        ? new Types.ObjectId(createTaskDto.locationId)
        : undefined,
    });
    return createdTask.save();
  }

  async assignTask(
    taskId: string,
    staffId: string,
  ): Promise<TaskDocument | null> {
    return this.taskModel.findByIdAndUpdate(
      taskId,
      { assignedStaff: new Types.ObjectId(staffId), autoAssigned: false },
      { new: true },
    );
  }

  async updateStatus(
    taskId: string,
    status: TaskStatus,
  ): Promise<TaskDocument | null> {
    const task = await this.taskModel.findById(taskId).exec();

    if (!task) {
      throw new NotFoundException(`Task with ID "${taskId}" not found.`);
    }

    const oldStatus = task.status;
    task.status = status; // Update status first

    // Check if status is changing to COMPLETED
    if (oldStatus !== TaskStatus.COMPLETED && status === TaskStatus.COMPLETED) {
      // Task is being completed, deduct inventory
      const requirements = TASK_INVENTORY_REQUIREMENTS[task.type];
      if (requirements) {
        for (const req of requirements) {
          try {
            await this.inventoryService.deductStock(req.itemName, req.quantity);
          } catch (error) {
            console.error(
              `Failed to deduct inventory for task ${(task as any)._id}: ${error.message}`,
            ); // Cast task to any
            // Decide how to handle failure: prevent status change, log, alert?
            // For now, just log and continue, but this might need refinement.
          }
        }
      }

      // Trigger notification for task completed
      // Determine recipient: Maybe the assigned staff, or manager/admin?
      // For now, let's notify managers/admins
      this.notificationsService.sendNotification(
        NotificationType.TASK_COMPLETED,
        { roles: [UserRole.ADMIN, UserRole.MANAGER] },
        {
          taskId: (task as any)._id.toString(), // Cast task to any
          taskType: task.type,
          assignedStaffId: (task as any).assignedStaff?.toString(), // Cast task to any
          donationId: (task as any).donation?.toString(), // Cast task to any
        },
      );
    }

    return task.save();
  }

  // Remove or comment out the following placeholder methods:
  // update(id: number, updateTaskDto: UpdateTaskDto) {
  //   return `This action updates a #${id} task`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} task`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} task`;
  // }

  // findAll() {
  //   return `This action returns all tasks`;
  // }
}
