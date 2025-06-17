import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule and ConfigService
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule for guards
import { Donation, DonationSchema } from '../donations/schemas/donation.schema'; // Import Donation schema
import { UsersModule } from '../users/users.module'; // Import UsersModule for RolesGuard and UserRole enum
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Payment, PaymentSchema } from './schemas/payment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: Donation.name, schema: DonationSchema }, // Register Donation schema to use DonationModel in service
    ]),
    AuthModule, // Import AuthModule to use JwtAuthGuard
    UsersModule, // Import UsersModule to use RolesGuard and UserRole enum
    ConfigModule, // Import ConfigModule to use ConfigService
  ],
  providers: [
    PaymentsService,
    // Provide Stripe client (optional, can be initialized in service constructor)
    // {
    //   provide: Stripe,
    //   useFactory: (configService: ConfigService) => new Stripe(configService.get<string>('stripe.secretKey'), { apiVersion: '2024-06-20' }),
    //   inject: [ConfigService],
    // },
  ],
  controllers: [PaymentsController],
  exports: [PaymentsService], // Export PaymentsService so DonationsService can use it
})
export class PaymentsModule {}
