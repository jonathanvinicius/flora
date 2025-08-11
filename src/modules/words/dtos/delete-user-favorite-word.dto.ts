import { IsDefined, IsString } from 'class-validator';

export class DeleteUserFavoriteDto {
  @IsDefined()
  @IsString()
  word: string;
}
