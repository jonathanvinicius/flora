import { IsDefined, IsString } from 'class-validator';

export class PostUserFavoriteDto {
  @IsDefined()
  @IsString()
  word: string;
}
