import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AirQualityModule } from './air-quality';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_DB_URI, { dbName: process.env.DB_NAME }),
    ScheduleModule.forRoot(),
    AirQualityModule,
  ],
})
export class AppModule {}
