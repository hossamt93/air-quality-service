import { ApiProperty } from '@nestjs/swagger';

export class ResponseBase<T> {
  @ApiProperty()
  result: T;
}
