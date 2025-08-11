import { IUsecase, IWORD_REPOSITORY, IWordRepository } from '@app/domain';
import { Inject, Injectable } from '@nestjs/common';
import { PageDto, PageMetaDto } from '@app/shared/dtos';
import { GetWordsResponse } from '../responses';
import { GetWordsDto } from '../dtos';
import { Op, WhereOptions } from 'sequelize';
import { WordModel } from '@app/infra/database/contexts/relational/words/model/word.model';

@Injectable()
export class GetWordsUseCase implements IUsecase {
  constructor(
    @Inject(IWORD_REPOSITORY)
    private readonly wordRepository: IWordRepository,
  ) {}

  async execute(params: GetWordsDto): Promise<PageDto<GetWordsResponse>> {
    const term = params?.search?.trim();
    const criteria: WhereOptions<WordModel> = {};

    if (term) {
      criteria.name = { [Op.iLike]: `%${term}%` };
    }
    const words = await this.wordRepository.findWithPagination({
      pageOptions: params,
      attributes: ['name'],
      criteria,
    });

    const meta = new PageMetaDto({
      pageOptions: params,
      count: words.meta.count,
    });

    return new PageDto<GetWordsResponse>(words.data, meta);
  }
}
