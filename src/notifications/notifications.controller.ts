import {
  Controller /*, Get, Post, Body, Patch, Param, Delete, UseGuards */,
} from '@nestjs/common'; // Comment out unused imports
import { NotificationsService } from './notifications.service';
// import { CreateNotificationDto } from './dto/create-notification.dto'; // Comment out unused imports
// import { UpdateNotificationDto } from './dto/update-notification.dto'; // Comment out unused imports
// import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'; // Comment out unused imports
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Comment out unused imports
// import { RolesGuard } from '../common/guards/roles.guard'; // Comment out unused imports
// import { Roles } from '../common/decorators/roles.decorator'; // Comment out unused imports
// import { UserRole } from '../users/schemas/user.schema'; // Comment out unused imports

// @ApiTags('notifications') // Comment out Swagger tag
@Controller('notifications')
// @ApiBearerAuth() // Comment out Swagger auth
// @UseGuards(JwtAuthGuard, RolesGuard) // Comment out guards
// @Roles(UserRole.ADMIN) // Comment out roles
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
}
