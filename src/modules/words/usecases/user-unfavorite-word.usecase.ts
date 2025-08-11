import {
  IUsecase,
  IUSER_FAVORITE_WORDS_REPOSITORY,
  IUserFavoriteWordRepository,
} from '@app/domain';
import { Inject, Injectable } from '@nestjs/common';
import { UserUnfavoriteWordDto } from '../dtos';
import { IRedisService } from '@app/infra/modules/cache';
import { CachePrefix } from '@app/domain/enums';

@Injectable()
export class UserUnFavoriteWordUseCase implements IUsecase {
  constructor(
    @Inject(IUSER_FAVORITE_WORDS_REPOSITORY)
    private readonly userFavoriteWordRepository: IUserFavoriteWordRepository,
    private readonly redisService: IRedisService,
  ) {}
  async execute(param: UserUnfavoriteWordDto): Promise<void> {
    await this.redisService.bumpVersion(
      `${CachePrefix.USER_FAVORITES}${param.userId}`,
    );
    const { id } = await this.userFavoriteWordRepository.findOne({
      where: { userId: param.userId, wordId: param.wordId },
    });

    await this.userFavoriteWordRepository.delete({ id });
  }
}
