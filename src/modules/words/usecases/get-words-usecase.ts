import { IUsecase, IWORD_REPOSITORY, IWordRepository } from '@app/domain';
import { Inject, Injectable } from '@nestjs/common';
import { PageDto, PageMetaDto, PageOptionsDto } from '@app/shared/dtos';
import { GetWordsResponse } from '../responses';

@Injectable()
export class GetWordsUseCase implements IUsecase {
  constructor(
    @Inject(IWORD_REPOSITORY)
    private readonly wordRepository: IWordRepository,
  ) {}

  async execute(params: PageOptionsDto): Promise<PageDto<GetWordsResponse>> {
    const words = await this.wordRepository.findWithPagination({
      pageOptions: params,
      attributes: ['name'],
    });

    const meta = new PageMetaDto({
      pageOptions: params,
      count: words.meta.count,
    });

    return new PageDto<GetWordsResponse>(words.data, meta);
  }
}
