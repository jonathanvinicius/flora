import { IsDefined, IsString } from 'class-validator';

export class GetWordDefinitionsDto {
  @IsDefined()
  @IsString()
  word: string;
}
