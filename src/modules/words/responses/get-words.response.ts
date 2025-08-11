import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetWordsResponse {
  @ApiProperty({ example: 'hello' })
  @IsString()
  name: string;
}
