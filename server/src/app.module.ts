import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CatsModule } from './modules/cats/cats.module';
import { DonorModule } from './modules/donor/donor.module';

@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [AppService, CatsModule, DonorModule],
})
export class AppModule {}
