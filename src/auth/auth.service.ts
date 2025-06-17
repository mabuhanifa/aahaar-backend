import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; // Import JwtService
import { CreateUserDto } from '../users/dto/create-user.dto'; // Import CreateUserDto
import { UserDocument } from '../users/schemas/user.schema'; // Import UserDocument
import { UsersService } from '../users/users.service'; // Import UsersService
import { JwtPayload } from './jwt.strategy'; // Import JwtPayload

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService, // Inject UsersService
    private jwtService: JwtService, // Inject JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await user.comparePassword(pass))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user.toObject(); // Exclude password from result
      return result;
    }
    return null;
  }

  async login(user: any) {
    // User object returned from validateUser
    const payload: JwtPayload = {
      sub: user._id,
      email: user.email,
      roles: user.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto): Promise<UserDocument> {
    // Check if user already exists
    const existingUser = await this.usersService.findOneByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }
    return this.usersService.create(createUserDto);
  }

  // Add Google OAuth methods later
}
