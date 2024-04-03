import { ApiProperty } from '@nestjs/swagger';
import { Location } from './location';
import { Pollution } from './pollution';
import { Weather } from './weather';

export interface IAirQuality {
  status: string;

  data: Data;
}

export class Data {
  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  location: Location;

  current: Current;
}

export class Current {
  pollution: Pollution;
  weather: Weather;
}
