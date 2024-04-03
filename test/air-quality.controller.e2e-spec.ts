import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AirQualityController } from '../src/air-quality/air-quality.controller';
import { AirQualityService } from '../src/air-quality/air-quality.service';
import { airQualityMock } from '../src/mocks';
import { AirQuality } from '../src/models';
import { IQAirService } from '../src/utils/services';

class MockAirQualityModel {
  static create = jest.fn();
  static aggregate = jest.fn().mockReturnValue([{ timestamp: airQualityMock.data.current.pollution.ts }]);
}

describe('AirQualityController (e2e)', () => {
  let app: INestApplication;
  let airQualityService: AirQualityService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AirQualityController],
      providers: [
        AirQualityService,
        IQAirService,
        ConfigService,
        {
          provide: getModelToken(AirQuality.name),
          useValue: MockAirQualityModel,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    airQualityService = moduleRef.get<AirQualityService>(AirQualityService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/airQuality/getNearstCity (GET)', async () => {
    const lat = 48.8566;
    const long = 2.3522;
    const mockPollution = airQualityMock.data.current.pollution;
    jest
      .spyOn(airQualityService, 'getNearstCityAirQuality')
      .mockResolvedValueOnce({ result: { pollution: mockPollution } });

    request(app.getHttpServer())
      .get('/v1/airQuality/getNearstCity')
      .query({ lat, long })
      .expect(HttpStatus.OK)
      .expect({ result: { pollution: mockPollution } });
  });

  it('/airQuality/getMostPollutedTimeByCity (GET)', async () => {
    const mockCity = 'Paris';
    const mockTimestamp = airQualityMock.data.current.pollution.ts;
    jest.spyOn(airQualityService, 'getMostPollutedTimeByCity').mockResolvedValueOnce({ timestamp: mockTimestamp });

    request(app.getHttpServer())
      .get('/v1/airQuality/getMostPollutedTimeByCity')
      .query({ city: mockCity })
      .expect(HttpStatus.OK)
      .expect({ timestamp: mockTimestamp });
  });
});
