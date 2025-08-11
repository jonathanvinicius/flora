import { PageOptionsDto } from '@app/shared/dtos';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional, IsString } from 'class-validator';

export class GetWordsDto extends PageOptionsDto {
  @ApiProperty({
    example: 'hello',
    required: false,
  })
  @IsDefined()
  @IsString()
  @IsOptional({ message: 'Filter name word' })
  search?: string;
}
