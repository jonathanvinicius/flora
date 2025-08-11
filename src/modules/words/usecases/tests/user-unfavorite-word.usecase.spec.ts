import { Test, TestingModule } from '@nestjs/testing';
import { UserUnFavoriteWordUseCase } from '../user-unfavorite-word.usecase';
import { IRedisService } from '@app/infra/modules/cache';
import { CachePrefix } from '@app/domain/enums';
import { createRedisServiceMock } from '@app/infra/modules/cache/redis/mock';
import { ConfigMock } from '@app/infra/config/config.mock';
import { UserFavoriteWordsDataModule } from '@app/infra/database/contexts/relational/user-favorite-words';
import { UserDataModule } from '@app/infra/database/contexts';
import { WordDataModule } from '@app/infra/database/contexts/relational/words';
import {
  createUserResponse,
  createWordResponse,
  createUserFavoriteResponses,
} from '@app/infra/database/contexts/relational/_fakers_';
import { UserFavoriteWordModel } from '@app/infra/database/contexts/relational/user-favorite-words/model/user-favorite-word.model';

describe('UserUnFavoriteWordUseCase', () => {
  let moduleRef: TestingModule;
  let useCase: UserUnFavoriteWordUseCase;

  const redisMock = createRedisServiceMock();

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ...ConfigMock,
        UserFavoriteWordsDataModule,
        UserDataModule,
        WordDataModule,
      ],
      providers: [
        UserUnFavoriteWordUseCase,
        { provide: IRedisService, useValue: redisMock },
      ],
    }).compile();

    useCase = moduleRef.get(UserUnFavoriteWordUseCase);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should bump cache version and delete the favorite', async () => {
    let user: any;
    let word: any;

    user = await createUserResponse();
    word = await createWordResponse({
      name: 'hungry',
      sourceUrls: ['https://en.wiktionary.org/wiki/hungry'],
    });
    await createUserFavoriteResponses({ userId: user.id, wordId: word.id });

    const before = await UserFavoriteWordModel.count({
      where: { userId: user.id, wordId: word.id },
    });

    await useCase.execute({ userId: user.id, wordId: word.id });

    const after = await UserFavoriteWordModel.count({
      where: { userId: user.id, wordId: word.id },
    });
    expect(before).toBe(1);
    expect(after).toBe(0);
    expect(redisMock.bumpVersion).toHaveBeenCalledWith(
      `${CachePrefix.USER_FAVORITES}${user.id}`,
    );
  });

  it('should throw if the favorite does not exist', async () => {
    let user: any;
    let word: any;

    user = await createUserResponse();
    word = await createWordResponse({
      name: 'apple',
      sourceUrls: ['https://en.wiktionary.org/wiki/apple'],
    });

    await expect(
      useCase.execute({ userId: user.id, wordId: word.id }),
    ).rejects.toBeTruthy();
    expect(redisMock.bumpVersion).toHaveBeenCalledWith(
      `${CachePrefix.USER_FAVORITES}${user.id}`,
    );
  });
});
