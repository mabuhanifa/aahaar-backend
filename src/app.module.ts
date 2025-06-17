import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import configuration from './config/configuration'; // Import the configuration file
import { DatabaseModule } from './database/database.module'; // Import DatabaseModule
import { DonationsModule } from './donations/donations.module';
import { InventoryModule } from './inventory/inventory.module';
import { LocationModule } from './location/location.module';
import { MediaModule } from './media/media.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PaymentsModule } from './payments/payments.module';
import { StaffModule } from './staff/staff.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration], // Load the configuration function
      isGlobal: true, // Make ConfigModule available globally
      envFilePath: '.env', // Specify the path to your .env file
      ignoreEnvFile: process.env.NODE_ENV === 'production', // Ignore .env in production
    }),
    DatabaseModule, // Add DatabaseModule here
    AuthModule,
    UsersModule,
    DonationsModule,
    TasksModule,
    StaffModule,
    MediaModule,
    InventoryModule,
    NotificationsModule,
    PaymentsModule,
    LocationModule,
    AdminModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
