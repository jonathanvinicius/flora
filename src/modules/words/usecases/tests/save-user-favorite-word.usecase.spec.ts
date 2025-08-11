import { Test, TestingModule } from '@nestjs/testing';
import { SaveUserFavoriteWordUseCase } from '../save-user-favorite-word.usecase';
import { IRedisService } from '@app/infra/modules/cache';
import { CachePrefix } from '@app/domain/enums';
import { createRedisServiceMock } from '@app/infra/modules/cache/redis/mock';
import { UserFavoriteWordsDataModule } from '@app/infra/database/contexts/relational/user-favorite-words';
import { ConfigMock } from '@app/infra/config/config.mock';
import { SaveUserFavoriteWordDto } from '../../dtos';
import {
  createUserResponse,
  createWordResponse,
} from '@app/infra/database/contexts/relational/_fakers_';
import { UserDataModule } from '@app/infra/database/contexts';
import { WordDataModule } from '@app/infra/database/contexts/relational/words';

describe('SaveUserFavoriteWordUseCase', () => {
  let module: TestingModule;
  let useCase: SaveUserFavoriteWordUseCase;
  let createdUser: any;
  let createdWord: any;

  const redisMock = createRedisServiceMock();

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ...ConfigMock,
        UserFavoriteWordsDataModule,
        UserDataModule,
        WordDataModule,
      ],
      providers: [
        SaveUserFavoriteWordUseCase,
        { provide: IRedisService, useValue: redisMock },
      ],
    }).compile();

    useCase = module.get<SaveUserFavoriteWordUseCase>(
      SaveUserFavoriteWordUseCase,
    );

    createdUser = await createUserResponse();
    createdWord = await createWordResponse();
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should bump cache version and save favorite', async () => {
    const dto: SaveUserFavoriteWordDto = {
      userId: createdUser.id,
      wordId: createdWord.id,
    };

    redisMock.get.mockResolvedValueOnce(1);
    await useCase.execute(dto);
    expect(redisMock.bumpVersion).toHaveBeenCalledWith(
      `${CachePrefix.USER_FAVORITES}${dto.userId}`,
    );
  });

  it('should bump cache version when saving favorite (no prior version)', async () => {
    let user: any;
    let word: any;

    user = await createUserResponse();
    word = await createWordResponse({
      name: 'hungry',
      sourceUrls: ['https://en.wiktionary.org/wiki/hungry'],
    });

    await useCase.execute({ userId: user.id, wordId: word.id });

    expect(redisMock.bumpVersion).toHaveBeenCalledWith(
      `${CachePrefix.USER_FAVORITES}${user.id}`,
    );
  });

  it('should call save(key, 2, 0) inside bumpVersion when no version is set', async () => {
    let user: any;
    let word: any;

    user = await createUserResponse();
    word = await createWordResponse({
      name: 'apple',
      sourceUrls: ['https://en.wiktionary.org/wiki/apple'],
    });

    redisMock.bumpVersion.mockImplementation(async (prefix: string) => {
      const key = `cache:ver:${prefix}`;
      await redisMock.save(key, 2, 0);
    });

    await useCase.execute({ userId: user.id, wordId: word.id });

    expect(redisMock.save).toHaveBeenCalledWith(
      `cache:ver:${CachePrefix.USER_FAVORITES}${user.id}`,
      2,
      0,
    );
  });
});
