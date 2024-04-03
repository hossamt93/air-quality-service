import { ConfigService } from '@nestjs/config';
import { airQualityMock } from '../../../mocks';
import { IQAirService } from '../iqair.service';

const configServiceMock = {
  get: jest.fn(),
};

global.fetch = require('jest-fetch-mock');

describe('IQAirService', () => {
  let iqAirService: IQAirService;

  beforeEach(() => {
    jest.clearAllMocks();
    iqAirService = new IQAirService(configServiceMock as unknown as ConfigService);
  });

  it('should fetch nearest city air quality', async () => {
    const mockLat = 48.8566;
    const mockLong = 2.3522;
    const mockApiKey = 'mock-api-key';
    const mockBaseUrl = 'https://mock-api-url.com';

    configServiceMock.get.mockReturnValueOnce(mockBaseUrl).mockReturnValueOnce(mockApiKey);
    (fetch as any).mockResponseOnce(JSON.stringify(airQualityMock));

    const result = await iqAirService.getNearstCityAirQuality(mockLat, mockLong);

    expect(configServiceMock.get).toHaveBeenNthCalledWith(1, 'AIR_QUALITY_API_BASE_URL');
    expect(configServiceMock.get).toHaveBeenNthCalledWith(2, 'AIR_QUALITY_API_KEY');
    expect(fetch).toHaveBeenCalledWith(
      `${mockBaseUrl}/v2/nearest_city?lat=${mockLat}&lon=${mockLong}&key=${mockApiKey}`,
    );
    expect(result).toEqual(airQualityMock);
  });

  it('should handle fetch error', async () => {
    const mockLat = 48.8566;
    const mockLong = 2.3522;
    const mockApiKey = 'mock-api-key';
    const mockBaseUrl = 'https://mock-api-url.com';

    configServiceMock.get.mockReturnValueOnce(mockBaseUrl).mockReturnValueOnce(mockApiKey);

    (fetch as any).mockRejectOnce(new Error('Mock fetch error'));

    await expect(iqAirService.getNearstCityAirQuality(mockLat, mockLong)).rejects.toThrow('Mock fetch error');

    expect(configServiceMock.get).toHaveBeenNthCalledWith(1, 'AIR_QUALITY_API_BASE_URL');
    expect(configServiceMock.get).toHaveBeenNthCalledWith(2, 'AIR_QUALITY_API_KEY');
    expect(fetch).toHaveBeenCalledWith(
      `${mockBaseUrl}/v2/nearest_city?lat=${mockLat}&lon=${mockLong}&key=${mockApiKey}`,
    );
  });
});
