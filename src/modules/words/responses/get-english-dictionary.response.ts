import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetEnglishDictionaryResponse {
  @ApiProperty({ example: 'English Dictionary' })
  @IsString()
  message: string;
}
