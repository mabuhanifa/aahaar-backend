import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from './schemas/user.schema';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('staff/:role')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'List staff users by role' })
  @ApiResponse({ status: 200, description: 'List of staff users.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden (Insufficient roles).' })
  async findStaffByRole(@Param('role') role: UserRole) {
    if (![UserRole.COOK, UserRole.MANAGER, UserRole.VOLUNTEER].includes(role)) {
      return [];
    }
    return this.usersService.findByRole(role);
  }

  @Get('staff')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'List all staff users (Cook, Manager, Volunteer)' })
  @ApiResponse({ status: 200, description: 'List of all staff users.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden (Insufficient roles).' })
  async findAllStaff() {
    const staffRoles = [UserRole.COOK, UserRole.MANAGER, UserRole.VOLUNTEER];
    return this.usersService.findByRoles(staffRoles);
  }
}
