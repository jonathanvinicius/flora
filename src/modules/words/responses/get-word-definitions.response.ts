import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class LicenseDto {
  @ApiProperty({ example: 'CC BY-SA 3.0' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'https://creativecommons.org/licenses/by-sa/3.0' })
  @IsString()
  url: string;
}

export class PhoneticDto {
  @ApiPropertyOptional({ example: '/həˈloʊ/' })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiPropertyOptional({
    example: 'https://api.dictionaryapi.dev/media/pronunciations/en/hello-uk.mp3',
    description: 'Pode vir vazio ("").',
  })
  @IsOptional()
  @IsString()
  audio?: string;

  @ApiPropertyOptional({
    example: 'https://commons.wikimedia.org/w/index.php?curid=9021983',
  })
  @IsOptional()
  @IsString()
  sourceUrl?: string;

  @ApiPropertyOptional({ type: () => LicenseDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => LicenseDto)
  license?: LicenseDto;
}

export class DefinitionDto {
  @ApiProperty({
    example: '"Hello!" or an equivalent greeting.',
  })
  @IsString()
  definition: string;

  @ApiPropertyOptional({ example: 'Hello, everyone.' })
  @IsOptional()
  @IsString()
  example?: string;

  @ApiPropertyOptional({ type: [String], example: [] })
  @IsOptional()
  @IsArray()
  @Type(() => String)
  synonyms?: string[];

  @ApiPropertyOptional({ type: [String], example: [] })
  @IsOptional()
  @IsArray()
  @Type(() => String)
  antonyms?: string[];
}

export class MeaningDto {
  @ApiProperty({ example: 'interjection' })
  @IsString()
  partOfSpeech: string;

  @ApiProperty({ type: [DefinitionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DefinitionDto)
  definitions: DefinitionDto[];

  @ApiPropertyOptional({ type: [String], example: [] })
  @IsOptional()
  @IsArray()
  @Type(() => String)
  synonyms?: string[];

  @ApiPropertyOptional({ type: [String], example: [] })
  @IsOptional()
  @IsArray()
  @Type(() => String)
  antonyms?: string[];
}

export class GetWordDefinitionsResponse {
  @ApiProperty({ example: 'hello' })
  @IsString()
  word: string;

  @ApiProperty({ type: [MeaningDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MeaningDto)
  meanings: MeaningDto[];

  @ApiProperty({ type: [PhoneticDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PhoneticDto)
  phonetics: PhoneticDto[];

  @ApiPropertyOptional({ type: () => LicenseDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => LicenseDto)
  license?: LicenseDto;

  @ApiPropertyOptional({
    type: [String],
    example: ['https://en.wiktionary.org/wiki/hello'],
  })
  @IsOptional()
  @IsArray()
  @Type(() => String)
  sourceUrls?: string[];
}
