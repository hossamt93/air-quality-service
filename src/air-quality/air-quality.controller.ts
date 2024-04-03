import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { CityDto, Pollution, ResponseBase } from '../dtos';
import { AirQualityService } from './air-quality.service';

@Controller({ version: '1', path: 'airQuality' })
@ApiTags('Air Quality')
export class AirQualityController {
  constructor(private readonly airQualityService: AirQualityService) {}

  @Get('getNearstCity')
  @ApiQuery({ name: 'lat', type: Number })
  @ApiQuery({ name: 'long', type: Number })
  @ApiResponse({
    schema: {
      properties: {
        result: {
          properties: {
            pollution: {
              $ref: getSchemaPath(Pollution),
            },
          },
        },
      },
    },
    status: HttpStatus.OK,
  })
  async getNearstCityAirQuality(
    @Query('lat') lat: number,
    @Query('long') long: number,
  ): Promise<ResponseBase<{ pollution: Pollution }>> {
    return await this.airQualityService.getNearstCityAirQuality(lat, long);
  }

  @Get('getMostPollutedTimeByCity')
  @ApiQuery({
    name: 'city',
    type: CityDto,
  })
  async getMostPollutedTimeByCity(@Query('city') city: string): Promise<{ timestamp: string }> {
    return await this.airQualityService.getMostPollutedTimeByCity(city);
  }
}
