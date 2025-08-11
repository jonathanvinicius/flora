import { Injectable } from '@nestjs/common';
import { IUserService } from './user.service.interface';
import { PageDto, PageOptionsDto } from '@app/shared/dtos';
import {
  GetUserFavoriteWordsUseCase,
  GetUserMeUseCase,
  GetUserWordHistoryUsecase,
} from './usecases';
import { GetUserFavoriteWordsResponse, GetUserMeResponse } from './responses';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly getUserFavoriteWordsUseCase: GetUserFavoriteWordsUseCase,
    private readonly getUserMeUseCase: GetUserMeUseCase,
    private readonly getUserWordHistoryUseCase: GetUserWordHistoryUsecase,
  ) {}

  async getUserFavoriteWords(
    params: PageOptionsDto,
    userId: string,
  ): Promise<PageDto<GetUserFavoriteWordsResponse>> {
    return this.getUserFavoriteWordsUseCase.execute(params, userId);
  }

  async getUserMe(userId: string): Promise<GetUserMeResponse> {
    return this.getUserMeUseCase.execute(userId);
  }

  async getUserWordHistory(params: PageOptionsDto, userId: string) {
    return this.getUserWordHistoryUseCase.execute(params, userId);
  }
}
