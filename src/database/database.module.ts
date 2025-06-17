import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule to use ConfigService
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'), // Get MONGO_URI from config
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
  ],
  exports: [MongooseModule], // Export MongooseModule if needed by other modules
})
export class DatabaseModule {}
