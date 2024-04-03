import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAirQuality } from '../../dtos';

@Injectable()
export class IQAirService {
  constructor(private readonly configService: ConfigService) {}
  async getNearstCityAirQuality(lat: number, long: number): Promise<IAirQuality> {
    const url = `${this.configService.get('AIR_QUALITY_API_BASE_URL')}/v2/nearest_city?lat=${lat}&lon=${long}&key=${this.configService.get('AIR_QUALITY_API_KEY')}`;
    const airQuality = await fetch(url);

    return await airQuality.json();
  }
}
