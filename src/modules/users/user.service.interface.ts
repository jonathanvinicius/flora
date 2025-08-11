import { PageDto, PageOptionsDto } from '@app/shared/dtos';
import { Injectable } from '@nestjs/common';
import {
  GetUserFavoriteWordsResponse,
  GetUserMeResponse,
  GetUserWordHistoryResponse,
} from './responses';

@Injectable()
export abstract class IUserService {
  abstract getUserFavoriteWords(
    params: PageOptionsDto,
    userId: string,
  ): Promise<PageDto<GetUserFavoriteWordsResponse>>;

  abstract getUserMe(userId: string): Promise<GetUserMeResponse>;

  abstract getUserWordHistory(
    params: PageOptionsDto,
    userId: string,
  ): Promise<PageDto<GetUserWordHistoryResponse>>;
}
