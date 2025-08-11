import {
  IUsecase,
  IUserSearchHistoryRepository,
  IUSER_SEARCH_HISTORY_REPOSITORY,
  IWORD_REPOSITORY,
  IWordRepository,
} from '@app/domain';
import { Inject, Injectable } from '@nestjs/common';
import { SaveUserHistoryDto } from '../dtos';
import { IRedisService } from '@app/infra/modules/cache';
import { CachePrefix } from '@app/domain/enums';

@Injectable()
export class SaveUserHistoryUseCase implements IUsecase {
  constructor(
    @Inject(IUSER_SEARCH_HISTORY_REPOSITORY)
    private readonly userSearchHistoryRepository: IUserSearchHistoryRepository,
    @Inject(IWORD_REPOSITORY)
    private readonly wordRepository: IWordRepository,
    private readonly redisService: IRedisService,
  ) {}

  async execute(params: SaveUserHistoryDto): Promise<void> {
    await this.redisService.bumpVersion(
      `${CachePrefix.USER_HISTORY}${params.userId}`,
    );

    const userSearchHistory = await this.userSearchHistoryRepository.findOne({
      where: {
        userId: params.userId,
        word: params.name,
      },
    });

    if (!userSearchHistory) {
      await this.userSearchHistoryRepository.create({
        word: params.name,
        userId: params.userId,
      });
    }

    const word = await this.wordRepository.findOne({
      where: { name: params.name },
      attributes: ['id'],
    });

    if (word && params?.definitionWord) {
      await this.wordRepository.update(word.id, {
        phonetics: params.definitionWord.phonetics,
        meanings: params.definitionWord.meanings,
        sourceUrls: params.definitionWord.sourceUrls,
        isCompleted: true,
      });
    }
  }
}
