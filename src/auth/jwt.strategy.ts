import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose'; // Import InjectModel
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose'; // Import Model and Types
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User, UserDocument } from '../users/schemas/user.schema'; // Import User and UserDocument

// Define the payload type for the JWT token
export interface JwtPayload {
  sub: string; // User ID (as string from JWT)
  email: string;
  roles: string[]; // User roles
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>, // Inject User model
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret') as string,
    });
  }

  // This method is called after the token is validated
  async validate(payload: JwtPayload): Promise<UserDocument | null> {
    // Return UserDocument or null
    // Fetch the user from the database to ensure they still exist and get full document
    const user = await this.userModel.findById(payload.sub).exec();

    if (!user) {
      return null; // User not found
    }

    // You can perform additional checks here if needed (e.g., user status)

    return user; // Return the full user document
  }
}
