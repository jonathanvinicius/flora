import {
  IUsecase,
  IUSER_FAVORITE_WORDS_REPOSITORY,
  IUserFavoriteWordRepository,
} from '@app/domain';
import { WordModel } from '@app/infra/database/contexts/relational/words/model/word.model';
import { PageDto, PageMetaDto, PageOptionsDto } from '@app/shared/dtos';
import { Inject, Injectable } from '@nestjs/common';
import { GetUserFavoriteWordsResponse } from '../responses';

@Injectable()
export class GetUserFavoriteWordsUseCase implements IUsecase {
  constructor(
    @Inject(IUSER_FAVORITE_WORDS_REPOSITORY)
    private readonly userFavoriteWordRepository: IUserFavoriteWordRepository,
  ) {}

  async execute(
    params: PageOptionsDto,
    userId: string,
  ): Promise<PageDto<GetUserFavoriteWordsResponse>> {
    const userFavoriteWord =
      await this.userFavoriteWordRepository.findWithPagination({
        pageOptions: params,
        include: [{ model: WordModel, attributes: ['name'] }],
        criteria: { userId },
        attributes: ['added'],
      });

    const userFavoriteFormat = userFavoriteWord.data.map((userFavoriteWord) => {
      return {
        word: userFavoriteWord.word.name,
        added: userFavoriteWord.added,
      };
    });

    const meta = new PageMetaDto({
      pageOptions: params,
      count: userFavoriteWord.meta.count,
    });

    return new PageDto<GetUserFavoriteWordsResponse>(userFavoriteFormat, meta);
  }
}
