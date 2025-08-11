import { IsDefined, IsString } from 'class-validator';

export class SaveUserFavoriteWordDto {
  @IsDefined()
  @IsString()
  wordId: string;

  @IsDefined()
  @IsString()
  userId: string;
}
