import { IsDefined, IsString } from 'class-validator';

export class UserUnfavoriteWordDto {
  @IsDefined()
  @IsString()
  wordId: string;

  @IsDefined()
  @IsString()
  userId: string;
}
