import { Injectable } from '@nestjs/common';
import {
  DeleteUserFavoriteDto,
  GetWordDefinitionsDto,
  PostUserFavoriteDto,
  SaveUserFavoriteWordDto,
  SaveUserHistoryDto,
} from './dtos';
import {
  DeleteUserFavoriteWordUseCase,
  GetEnglishDictionaryUseCase,
  GetWordDefinitionsUseCase,
  GetWordsUseCase,
  PostUserFavoriteWordUseCase,
  SaveUserFavoriteWordUseCase,
  SaveUserHistoryUseCase,
  UserUnFavoriteWordUseCase,
} from './usecases';
import { IWordService } from './word.service.interface';
import { PageDto, PageOptionsDto } from '@app/shared/dtos';
import { UserUnFavoriteWordDTO } from '@app/infra/modules/rabbitmq/src/services/user-favorite-words/dto/user-unfavorite-word.dto';
import {
  GetEnglishDictionaryResponse,
  GetWordDefinitionsResponse,
  GetWordsResponse,
} from './responses';

@Injectable()
export class WordService implements IWordService {
  constructor(
    private readonly getEnglishDictionaryUseCase: GetEnglishDictionaryUseCase,
    private readonly getWordDefinitionWordUseCase: GetWordDefinitionsUseCase,
    private readonly saveUserHistoryUseCase: SaveUserHistoryUseCase,
    private readonly getWordsUseCase: GetWordsUseCase,
    private readonly saveUserFavoriteWordUseCase: SaveUserFavoriteWordUseCase,
    private readonly postUserFavoriteWordUseCase: PostUserFavoriteWordUseCase,
    private readonly deleteUserFavoriteWordUseCase: DeleteUserFavoriteWordUseCase,
    private readonly userUnfavoriteWordUseCase: UserUnFavoriteWordUseCase,
  ) {}

  async getEnglishDictionary(): Promise<GetEnglishDictionaryResponse> {
    return this.getEnglishDictionaryUseCase.execute();
  }

  async getDefinitionsWord(
    params: GetWordDefinitionsDto,
    userId: string,
  ): Promise<GetWordDefinitionsResponse> {
    return this.getWordDefinitionWordUseCase.execute(params, userId);
  }

  async saveUserHistory(params: SaveUserHistoryDto): Promise<void> {
    await this.saveUserHistoryUseCase.execute(params);
  }

  async getWords(params: PageOptionsDto): Promise<PageDto<GetWordsResponse>> {
    return this.getWordsUseCase.execute(params);
  }

  async postUserFavoriteWord(
    params: PostUserFavoriteDto,
    userId: string,
  ): Promise<void> {
    await this.postUserFavoriteWordUseCase.execute(params, userId);
  }

  async saveUserFavoriteWord(params: SaveUserFavoriteWordDto): Promise<void> {
    await this.saveUserFavoriteWordUseCase.execute(params);
  }

  async deleteUserFavoriteWord(
    param: DeleteUserFavoriteDto,
    userId: string,
  ): Promise<void> {
    await this.deleteUserFavoriteWordUseCase.execute(param, userId);
  }

  async userUnfavorite(param: UserUnFavoriteWordDTO) {
    await this.userUnfavoriteWordUseCase.execute(param);
  }
}
