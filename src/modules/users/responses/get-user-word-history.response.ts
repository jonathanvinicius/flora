import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

export class GetUserWordHistoryResponse {
  @ApiProperty({ example: 'hello' })
  @IsString()
  word: string;

  @ApiProperty({ example: 'hello' })
  @IsDateString()
  added: Date;
}
