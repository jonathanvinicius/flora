import {
  IUsecase,
  IUSER_FAVORITE_WORDS_REPOSITORY,
  IUserFavoriteWordRepository,
} from '@app/domain';
import { Inject, Injectable } from '@nestjs/common';
import { SaveUserFavoriteWordDto } from '../dtos';
import { CachePrefix } from '@app/domain/enums';
import { IRedisService } from '@app/infra/modules/cache';

@Injectable()
export class SaveUserFavoriteWordUseCase implements IUsecase {
  constructor(
    @Inject(IUSER_FAVORITE_WORDS_REPOSITORY)
    private readonly userFavoriteWordRepository: IUserFavoriteWordRepository,
    private readonly redisService: IRedisService,
  ) {}
  async execute(param: SaveUserFavoriteWordDto): Promise<void> {
    await this.redisService.bumpVersion(
      `${CachePrefix.USER_FAVORITES}${param.userId}`,
    );

    await this.userFavoriteWordRepository.save({
      userId: param.userId,
      wordId: param.wordId,
    });
  }
}
