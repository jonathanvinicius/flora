import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

export class GetUserMeResponse {
  @ApiProperty({ example: '565a91fc-f3fc-42f4-8213-6ae289b183df' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'john' })
  @IsString()
  email: string;
}
