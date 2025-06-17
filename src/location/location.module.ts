import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule for guards
import { UsersModule } from '../users/users.module'; // Import UsersModule for RolesGuard and UserRole enum
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { Location, LocationSchema } from './schemas/location.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
    ]),
    AuthModule, // Import AuthModule to use JwtAuthGuard
    UsersModule, // Import UsersModule to use RolesGuard and UserRole enum
  ],
  providers: [LocationService],
  controllers: [LocationController],
  exports: [LocationService], // Export LocationService if needed elsewhere
})
export class LocationModule {}
