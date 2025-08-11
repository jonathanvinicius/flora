import {
  IUsecase,
  IUSER_SEARCH_HISTORY_REPOSITORY,
  IUserSearchHistoryRepository,
} from '@app/domain';
import { PageDto, PageOptionsDto } from '@app/shared/dtos';
import { Inject, Injectable } from '@nestjs/common';
import { GetUserWordHistoryResponse } from '../responses';

@Injectable()
export class GetUserWordHistoryUsecase implements IUsecase {
  constructor(
    @Inject(IUSER_SEARCH_HISTORY_REPOSITORY)
    private readonly userSearchHistoryRepository: IUserSearchHistoryRepository,
  ) {}

  async execute(
    params: PageOptionsDto,
    userId: string,
  ): Promise<PageDto<GetUserWordHistoryResponse>> {
    return this.userSearchHistoryRepository.findWithPagination({
      pageOptions: params,
      attributes: ['word', 'added'],
      criteria: { userId },
    });
  }
}
