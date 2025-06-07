import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import dbConfig from './configs/db.config';
import { AuthModule } from './modules/auth/auth.module';
import { CatsModule } from './modules/cats/cats.module';
import { DonorModule } from './modules/donor/donor.module';

@Module({
  imports: [AuthModule, MongooseModule.forRoot(dbConfig.uri)],
  controllers: [AppController],
  providers: [AppService, CatsModule, DonorModule],
})
export class AppModule {}
