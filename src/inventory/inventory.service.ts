import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationType } from '../notifications/enums/notification-type.enum'; // Import NotificationType
import { NotificationsService } from '../notifications/notifications.service'; // Import NotificationsService
import { UserRole } from '../users/schemas/user.schema'; // Import UserRole
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import {
  InventoryItem,
  InventoryItemDocument,
} from './schemas/inventory-item.schema';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name); // Add logger

  constructor(
    @InjectModel(InventoryItem.name)
    private inventoryItemModel: Model<InventoryItemDocument>,
    private notificationsService: NotificationsService, // Inject NotificationsService
  ) {}

  async create(
    createInventoryItemDto: CreateInventoryItemDto,
  ): Promise<InventoryItemDocument> {
    const createdItem = new this.inventoryItemModel(createInventoryItemDto);
    return createdItem.save();
  }

  async findAll(): Promise<InventoryItemDocument[]> {
    return this.inventoryItemModel.find().exec();
  }

  async findOne(id: string): Promise<InventoryItemDocument | null> {
    return this.inventoryItemModel.findById(id).exec();
  }

  async update(
    id: string,
    updateInventoryItemDto: UpdateInventoryItemDto,
  ): Promise<InventoryItemDocument | null> {
    return this.inventoryItemModel
      .findByIdAndUpdate(id, updateInventoryItemDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<InventoryItemDocument | null> {
    return this.inventoryItemModel.findByIdAndDelete(id).exec();
  }

  async deductStock(
    itemName: string,
    quantity: number,
  ): Promise<InventoryItemDocument | null> {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity to deduct must be positive.');
    }
    const item = await this.inventoryItemModel
      .findOne({ name: itemName })
      .exec();
    if (!item) {
      throw new NotFoundException(`Inventory item "${itemName}" not found.`);
    }
    if (item.stock < quantity) {
      this.logger.warn(
        `Attempted to deduct ${quantity} of ${itemName}, but only ${item.stock} is available.`,
      );
      // Decide how to handle failure
    }

    item.stock -= quantity;
    const updatedItem = await item.save();

    // Check for low stock after deduction
    this.checkLowStock(updatedItem);

    return updatedItem;
  }

  async addStock(
    itemName: string,
    quantity: number,
  ): Promise<InventoryItemDocument | null> {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity to add must be positive.');
    }
    const item = await this.inventoryItemModel
      .findOne({ name: itemName })
      .exec();
    if (!item) {
      throw new NotFoundException(`Inventory item "${itemName}" not found.`);
    }

    item.stock += quantity;
    const updatedItem = await item.save();
    // Check for low stock after adding (in case it was below threshold)
    this.checkLowStock(updatedItem);
    return updatedItem;
  }

  private checkLowStock(item: InventoryItemDocument): void {
    if (item.stock <= item.lowStockThreshold) {
      this.logger.warn(
        `Low stock alert: "${item.name}" is at ${item.stock} ${item.unit}. Threshold is ${item.lowStockThreshold}.`,
      );
      // Trigger low stock notification
      this.notificationsService.sendNotification(
        NotificationType.LOW_INVENTORY,
        { roles: [UserRole.ADMIN, UserRole.MANAGER] }, // Notify managers/admins by role
        {
          itemName: item.name,
          stock: item.stock,
          threshold: item.lowStockThreshold,
          unit: item.unit,
        },
      );
    }
  }

  // TODO: Add methods for getting low stock items, etc.
}
