import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AirQuality, airQualitySchema } from '../models';
import { IQAirService } from '../utils/services';
import { AirQualityController } from './air-quality.controller';
import { AirQualityService } from './air-quality.service';

@Module({
  controllers: [AirQualityController],
  imports: [MongooseModule.forFeature([{ name: AirQuality.name, schema: airQualitySchema }])],
  providers: [AirQualityService, ConfigService, IQAirService],
})
export class AirQualityModule {}
