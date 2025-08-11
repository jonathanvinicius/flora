import { Injectable } from '@nestjs/common';
import {
  DeleteUserFavoriteDto,
  GetWordDefinitionsDto,
  PostUserFavoriteDto,
  SaveUserFavoriteWordDto,
  SaveUserHistoryDto,
  UserUnfavoriteWordDto,
} from './dtos';
import { PageDto, PageOptionsDto } from '@app/shared/dtos';
import {
  GetEnglishDictionaryResponse,
  GetWordDefinitionsResponse,
  GetWordsResponse,
} from './responses';

@Injectable()
export abstract class IWordService {
  abstract getEnglishDictionary(): Promise<GetEnglishDictionaryResponse>;
  /**
   * Get definition word - API
   */
  abstract getDefinitionsWord(
    params: GetWordDefinitionsDto,
    userId: string,
  ): Promise<GetWordDefinitionsResponse>;

  abstract saveUserHistory(params: SaveUserHistoryDto): Promise<void>;

  abstract getWords(params: PageOptionsDto): Promise<PageDto<GetWordsResponse>>;

  abstract postUserFavoriteWord(
    params: PostUserFavoriteDto,
    userId: string,
  ): Promise<void>;

  abstract saveUserFavoriteWord(params: SaveUserFavoriteWordDto): Promise<void>;

  abstract deleteUserFavoriteWord(
    param: DeleteUserFavoriteDto,
    userId: string,
  ): Promise<void>;

  abstract userUnfavorite(param: UserUnfavoriteWordDto): Promise<void>;
}
