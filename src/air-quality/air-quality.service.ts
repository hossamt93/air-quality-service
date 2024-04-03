import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Pollution, ResponseBase } from '../dtos';
import { AirQuality } from '../models';
import { IQAirService } from '../utils/services';

@Injectable()
export class AirQualityService {
  private readonly logger = new Logger(AirQualityService.name);

  constructor(
    private readonly iqAirService: IQAirService,
    @InjectModel(AirQuality.name)
    private readonly airQualityModel: Model<AirQuality>,
  ) {}
  async getNearstCityAirQuality(lat: number, long: number): Promise<ResponseBase<{ pollution: Pollution }>> {
    try {
      const airQualityInstance = await this.iqAirService.getNearstCityAirQuality(lat, long);
      if (airQualityInstance.status == 'success') {
        return { result: { pollution: airQualityInstance.data.current.pollution } };
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getMostPollutedTimeByCity(city: string) {
    const result = await this.airQualityModel.aggregate([
      { $match: { city } },
      { $sort: { 'current.pollution.aqius': -1 } },
      { $limit: 1 },
      { $project: { timestamp: '$current.pollution.ts', _id: 0 } },
    ]);
    return result[0];
  }

  @Cron('*/1 * * * *')
  async checkParisAirQuality() {
    this.logger.log(`Pulling Paris Air Quality Started At: ${new Date().toLocaleString()}`);
    const [lat, long] = [48.856613, 2.352222];
    const airQualityInstance = await this.iqAirService.getNearstCityAirQuality(lat, long);
    if (airQualityInstance.status == 'success') {
      await this.airQualityModel.create(airQualityInstance.data);
    }

    this.logger.log(`Pulling Paris Air Quality Finished At: ${new Date().toLocaleString()}`);
  }
}
