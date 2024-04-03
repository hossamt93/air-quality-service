import { ApiProperty } from '@nestjs/swagger';

export class Location {
  @ApiProperty()
  type: string;

  @ApiProperty()
  coordinates: number[];
}
