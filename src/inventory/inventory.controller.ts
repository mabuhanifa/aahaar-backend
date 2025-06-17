import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../users/schemas/user.schema';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { InventoryService } from './inventory.service';

@ApiTags('inventory')
@Controller('inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard) // Protect all inventory endpoints
@Roles(UserRole.ADMIN, UserRole.MANAGER) // Only ADMIN and MANAGER can manage inventory
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new inventory item' })
  @ApiResponse({ status: 201, description: 'Inventory item created.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden (Insufficient roles).' })
  create(@Body() createInventoryItemDto: CreateInventoryItemDto) {
    return this.inventoryService.create(createInventoryItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all inventory items' })
  @ApiResponse({ status: 200, description: 'List of inventory items.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden (Insufficient roles).' })
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific inventory item by ID' })
  @ApiResponse({ status: 200, description: 'Inventory item details.' })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden (Insufficient roles).' })
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific inventory item by ID' })
  @ApiResponse({ status: 200, description: 'Inventory item updated.' })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden (Insufficient roles).' })
  update(
    @Param('id') id: string,
    @Body() updateInventoryItemDto: UpdateInventoryItemDto,
  ) {
    return this.inventoryService.update(id, updateInventoryItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific inventory item by ID' })
  @ApiResponse({ status: 200, description: 'Inventory item deleted.' })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden (Insufficient roles).' })
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(id);
  }

  // Optional: Endpoints for explicitly adding/deducting stock
  // @Patch(':id/deduct/:quantity')
  // @ApiOperation({ summary: 'Deduct stock from an inventory item' })
  // async deduct(@Param('id') id: string, @Param('quantity') quantity: number) {
  //    // Need to implement deductById in service or use name
  //    // return this.inventoryService.deductStock(id, quantity);
  // }
}
