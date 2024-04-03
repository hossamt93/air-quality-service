import { ApiProperty } from '@nestjs/swagger';

export class CityDto {
  @ApiProperty({ default: 'Paris', required: true, type: String })
  city: string;
}
