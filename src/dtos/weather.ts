import { ApiProperty } from '@nestjs/swagger';

export class Weather {
  @ApiProperty()
  ts: string;

  @ApiProperty()
  tp: number;

  @ApiProperty()
  pr: number;

  @ApiProperty()
  hu: number;

  @ApiProperty()
  ws: number;

  @ApiProperty()
  wd: number;

  @ApiProperty()
  ic: string;
}
