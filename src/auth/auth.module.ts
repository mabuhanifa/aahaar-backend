import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigModule and ConfigService
import { JwtModule } from '@nestjs/jwt'; // Import JwtModule
import { MongooseModule } from '@nestjs/mongoose'; // Import MongooseModule
import { PassportModule } from '@nestjs/passport'; // Import PassportModule
import { User, UserSchema } from '../users/schemas/user.schema'; // Import User schema
import { UsersModule } from '../users/users.module'; // Import UsersModule
import { AuthController } from './auth.controller'; // Import AuthController
import { AuthService } from './auth.service'; // Import AuthService
import { JwtAuthGuard } from './guards/jwt-auth.guard'; // Import JwtAuthGuard
import { JwtStrategy } from './jwt.strategy'; // Import JwtStrategy

@Module({
  imports: [
    ConfigModule, // Import ConfigModule
    PassportModule, // Add PassportModule
    UsersModule, // Import UsersModule
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Register User schema for JwtStrategy
    JwtModule.registerAsync({
      // Configure JwtModule asynchronously
      imports: [ConfigModule], // Import ConfigModule to use ConfigService
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'), // Get secret from config
        signOptions: { expiresIn: configService.get<string>('jwt.expiresIn') }, // Get expiry from config
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard], // Add AuthService, JwtStrategy, and JwtAuthGuard as providers
  controllers: [AuthController], // Add AuthController
  exports: [AuthService, JwtModule, JwtAuthGuard], // Export AuthService, JwtModule, and JwtAuthGuard so they can be used in other modules
})
export class AuthModule {}
