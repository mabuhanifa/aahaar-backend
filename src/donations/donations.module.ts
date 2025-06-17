import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsModule } from '../notifications/notifications.module';
import { PaymentsModule } from '../payments/payments.module'; // Import PaymentsModule
import { UsersModule } from '../users/users.module';
import { DonationsController } from './donations.controller';
import { DonationsService } from './donations.service';
import { Donation, DonationSchema } from './schemas/donation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Donation.name, schema: DonationSchema },
    ]),
    UsersModule,
    NotificationsModule,
    PaymentsModule, // Add PaymentsModule here
  ],
  providers: [DonationsService],
  controllers: [DonationsController],
  // exports: [DonationsService],
})
export class DonationsModule {}
