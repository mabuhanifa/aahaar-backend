import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UserDocument } from '../users/schemas/user.schema';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto/create-donation.dto';

// Extend the Request type to include user property from Passport
interface AuthenticatedRequest extends Request {
  user: UserDocument; // Assuming JwtStrategy attaches the user document
}

@ApiTags('donations') // Tag the controller for Swagger
@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new donation (authenticated or anonymous)',
  })
  @ApiResponse({ status: 201, description: 'Donation successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  // @ApiBearerAuth() // Uncomment if using JwtAuthGuard
  // @UseGuards(JwtAuthGuard) // Optional: Use guard if only authenticated users can donate
  async create(
    @Body() createDonationDto: CreateDonationDto,
    @Req() req: AuthenticatedRequest,
  ) {
    // Check if user is authenticated (optional, depends on whether endpoint is public)
    const user = req.user; // User will be attached by JwtAuthGuard if used

    // Handle both authenticated and anonymous donations
    if (user) {
      // Authenticated donation
      return this.donationsService.create(createDonationDto, user);
    } else {
      // Anonymous donation
      // Ensure anonymousDonorEmail is provided if required for anonymous
      if (!createDonationDto.anonymousDonorEmail) {
        // Handle error: anonymous email required for anonymous donation
        // throw new BadRequestException('Anonymous donor email is required for anonymous donations');
        // For now, allow anonymous without email, but reference ID is generated
      }
      return this.donationsService.create(createDonationDto);
    }
  }

  // Remove or comment out the following placeholder methods:

  // @Get()
  // findAll(@Query() filterDto: FilterDonationsDto) { ... }

  // @Get(':id')
  // findOne(@Param('id') id: string) { ... }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDonationDto: UpdateDonationDto) { ... }

  // @Delete(':id')
  // remove(@Param('id') id: string) { ... }
}
