import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'; // Import Swagger decorators
import { CreateUserDto } from '../users/dto/create-user.dto'; // Import CreateUserDto
import { AuthService } from './auth.service'; // Import AuthService
import { LoginDto } from './dto/login.dto'; // Import LoginDto

@ApiTags('auth') // Tag the controller for Swagger
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' }) // Describe the operation
  @ApiResponse({ status: 201, description: 'User successfully registered.' }) // Describe responses
  @ApiResponse({
    status: 401,
    description: 'User with this email already exists.',
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  // We will use a LocalAuthGuard for the login endpoint
  // @UseGuards(LocalAuthGuard) // Uncomment this after creating LocalAuthGuard
  @Post('login')
  @ApiOperation({ summary: 'Login user and get JWT token' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in.',
    schema: { example: { access_token: '...' } },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials'); // Add message for clarity
    }
    return this.authService.login(user);
  }

  // Add Google OAuth endpoints later
}
