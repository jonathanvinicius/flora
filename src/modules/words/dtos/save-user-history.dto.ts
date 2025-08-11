import { DictionaryEntry } from '@app/libs/dictionary-api/src/responses/get-definition-word.response';
import { IsDefined, IsOptional, IsString } from 'class-validator';

export class SaveUserHistoryDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsString()
  userId: string;

  @IsDefined()
  @IsString()
  @IsOptional()
  definitionWord?: DictionaryEntry;
}
