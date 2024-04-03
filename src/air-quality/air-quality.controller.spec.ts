import { HttpException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { airQualityMock } from '../mocks';
import { AirQuality } from '../models';
import { IQAirService } from '../utils/services';
import { AirQualityController } from './air-quality.controller';
import { AirQualityService } from './air-quality.service';

class MockAirQualityModel {
  static create = jest.fn();
  static aggregate = jest.fn().mockReturnValue([{ timestamp: airQualityMock.data.current.pollution.ts }]);
}

describe('AirQualityController', () => {
  let moduleRef: TestingModule;
  let airQualityController: AirQualityController;
  let airQualityService: AirQualityService;
  let iqairService: IQAirService;

  const [lat, long] = [48.856613, 2.352222];

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
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

    airQualityService = moduleRef.get<AirQualityService>(AirQualityService);
    airQualityController = moduleRef.get<AirQualityController>(AirQualityController);
    iqairService = moduleRef.get<IQAirService>(IQAirService);
  });

  describe('AirQualityModule', () => {
    it('should has all the module pieces defined', () => {
      expect(moduleRef.get<AirQualityService>(AirQualityService)).toBeDefined();
      expect(moduleRef.get<AirQualityController>(AirQualityController)).toBeDefined();
      expect(moduleRef.get<IQAirService>(IQAirService)).toBeDefined();
    });
  });

  describe('getNearstCityAirQuality', () => {
    it('should return the nearst city air quality', async () => {
      const mockAirQualityServiceReturn = {
        result: { pollution: airQualityMock.data.current.pollution },
      };
      jest.spyOn(iqairService, 'getNearstCityAirQuality').mockResolvedValue(airQualityMock);
      const neartsCitySpy = jest.spyOn(airQualityService, 'getNearstCityAirQuality');
      expect(await airQualityController.getNearstCityAirQuality(lat, long)).toStrictEqual(mockAirQualityServiceReturn);
      expect(neartsCitySpy).toHaveBeenCalledWith(lat, long);
    });

    it('should not return anyting when the IQAir service reply with fail', async () => {
      const failAirQualitymock = {
        ...airQualityMock,
        status: 'fail',
      };
      jest.spyOn(iqairService, 'getNearstCityAirQuality').mockResolvedValue(failAirQualitymock);
      const neartsCitySpy = jest.spyOn(airQualityService, 'getNearstCityAirQuality');
      await airQualityController.getNearstCityAirQuality(lat, long);
      expect(neartsCitySpy).toHaveBeenCalledWith(lat, long);
      await expect(airQualityController.getNearstCityAirQuality(lat, long)).resolves.toBeUndefined();
    });

    it('should fail to return the nearst city air quality', async () => {
      try {
        const simulatedError = new Error('Simulated Error');
        jest.spyOn(iqairService, 'getNearstCityAirQuality').mockRejectedValue(simulatedError);
        const neartsCitySpy = jest.spyOn(airQualityService, 'getNearstCityAirQuality');
        await airQualityController.getNearstCityAirQuality(lat, long);
        expect(neartsCitySpy).toHaveBeenCalledWith(lat, long);
      } catch (ex) {
        expect(ex).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('getMostPollutedTimeByCity', () => {
    it('should return the most polluted time by a given city', async () => {
      const mockMostPollutedTime = { timestamp: airQualityMock.data.current.pollution.ts };
      const city = 'Paris';
      const mostPollutedTimeSpy = jest.spyOn(airQualityService, 'getMostPollutedTimeByCity');
      expect(await airQualityController.getMostPollutedTimeByCity(city)).toStrictEqual(mockMostPollutedTime);
      expect(mostPollutedTimeSpy).toHaveBeenCalledWith(city);
      expect(MockAirQualityModel.aggregate).toHaveBeenCalledWith([
        { $match: { city } },
        { $sort: { 'current.pollution.aqius': -1 } },
        { $limit: 1 },
        { $project: { timestamp: '$current.pollution.ts', _id: 0 } },
      ]);
    });
  });

  describe('checkParisAirQuality', () => {
    beforeEach(() => jest.clearAllMocks());
    it('should store the pollution data', async () => {
      const loggerSpy = jest.spyOn(Logger.prototype, 'log');

      jest.spyOn(iqairService, 'getNearstCityAirQuality').mockResolvedValue(airQualityMock);
      jest.spyOn(airQualityService, 'checkParisAirQuality');
      await airQualityService.checkParisAirQuality();
      expect(loggerSpy).toHaveBeenNthCalledWith(
        1,
        `Pulling Paris Air Quality Started At: ${new Date().toLocaleString()}`,
      );
      expect(loggerSpy).toHaveBeenNthCalledWith(
        2,
        `Pulling Paris Air Quality Finished At: ${new Date().toLocaleString()}`,
      );
      expect(MockAirQualityModel.create).toHaveBeenCalledWith(airQualityMock.data);
    });

    it('should not store the pollution data wgen the status is fail', async () => {
      const failAirQualitymock = {
        ...airQualityMock,
        status: 'fail',
      };
      jest.spyOn(iqairService, 'getNearstCityAirQuality').mockResolvedValue(failAirQualitymock);
      jest.spyOn(airQualityService, 'checkParisAirQuality');
      await airQualityService.checkParisAirQuality();
      expect(MockAirQualityModel.create).not.toHaveBeenCalledWith(airQualityMock.data);
    });
  });
});
