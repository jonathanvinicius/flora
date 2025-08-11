import { Test, TestingModule } from '@nestjs/testing';
import { IRedisService } from '@app/infra/modules/cache';
import { CachePrefix } from '@app/domain/enums';
import { createRedisServiceMock } from '@app/infra/modules/cache/redis/mock';
import { UserFavoriteWordsDataModule } from '@app/infra/database/contexts/relational/user-favorite-words';
import { ConfigMock } from '@app/infra/config/config.mock';
import { SaveUserHistoryDto } from '../../dtos';
import {
  createUserResponse,
  createWordResponse,
} from '@app/infra/database/contexts/relational/_fakers_';
import {
  UserDataModule,
  UserSearchHistoryDataModule,
} from '@app/infra/database/contexts';
import { WordDataModule } from '@app/infra/database/contexts/relational/words';
import { SaveUserHistoryUseCase } from '../save-user-history.usecase';

describe('SaveUserHistoryUseCase', () => {
  let module: TestingModule;
  let useCase: SaveUserHistoryUseCase;
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
        UserSearchHistoryDataModule,
      ],
      providers: [
        SaveUserHistoryUseCase,
        { provide: IRedisService, useValue: redisMock },
      ],
    }).compile();

    useCase = module.get<SaveUserHistoryUseCase>(SaveUserHistoryUseCase);

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

  it('should bump cache version and save history', async () => {
    const dto: SaveUserHistoryDto = {
      userId: createdUser.id,
      name: createdWord.name,
      definitionWord: {
        word: createdWord.name,
        phonetics: [
          {
            text: '/ˈhʌŋ.ɡri/',
            audio:
              'https://api.dictionaryapi.dev/media/pronunciations/en/hungry-us.mp3',
            sourceUrl: 'https://en.wiktionary.org/wiki/hungry',
            license: {
              name: 'CC BY-SA 3.0',
              url: 'https://creativecommons.org/licenses/by-sa/3.0',
            },
          },
        ],
        meanings: [
          {
            partOfSpeech: 'adjective',
            definitions: [
              {
                definition: 'Feeling the need or desire for food.',
                example: 'I am hungry after the long walk.',
                synonyms: ['starving', 'famished'],
                antonyms: ['full', 'satisfied'],
              },
            ],
            synonyms: ['peckish', 'ravenous'],
            antonyms: ['satiated'],
          },
        ],
        license: {
          name: 'CC BY-SA 3.0',
          url: 'https://creativecommons.org/licenses/by-sa/3.0',
        },
        sourceUrls: ['https://en.wiktionary.org/wiki/hungry'],
      },
    };

    redisMock.get.mockResolvedValueOnce(1);
    await useCase.execute(dto);
    expect(redisMock.bumpVersion).toHaveBeenCalledWith(
      `${CachePrefix.USER_HISTORY}${dto.userId}`,
    );
  });

  it('should bump cache version when saving history (no prior version)', async () => {
    let user: any;
    let word: any;

    user = await createUserResponse();
    word = await createWordResponse({
      name: 'hungry',
      sourceUrls: ['https://en.wiktionary.org/wiki/hungry'],
    });

    await useCase.execute({ userId: user.id, name: word.name });

    expect(redisMock.bumpVersion).toHaveBeenCalledWith(
      `${CachePrefix.USER_HISTORY}${user.id}`,
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

    await useCase.execute({ userId: user.id, name: word.name });

    expect(redisMock.save).toHaveBeenCalledWith(
      `cache:ver:${CachePrefix.USER_HISTORY}${user.id}`,
      2,
      0,
    );
  });
});
