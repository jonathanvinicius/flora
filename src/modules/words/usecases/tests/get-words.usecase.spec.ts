import { Test, TestingModule } from '@nestjs/testing';
import { ConfigMock } from '@app/infra/config/config.mock';
import { GetWordsUseCase } from '../get-words-usecase';
import { WordDataModule } from '@app/infra/database/contexts/relational/words';
import {
  createUserFavoriteResponses,
  createWordResponse,
} from '@app/infra/database/contexts/relational/_fakers_';
import { UserDataModule } from '@app/infra/database/contexts';
import { UserFavoriteWordsDataModule } from '@app/infra/database/contexts/relational/user-favorite-words';

describe('GetWordsUseCase', () => {
  let useCase: GetWordsUseCase;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ...ConfigMock,
        WordDataModule,
        UserDataModule,
        UserFavoriteWordsDataModule,
      ],
      providers: [GetWordsUseCase],
    }).compile();

    useCase = module.get<GetWordsUseCase>(GetWordsUseCase);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return a paginated list words', async () => {
    await createWordResponse({
      name: 'hungry',
      sourceUrls: ['https://en.wiktionary.org/wiki/hungry'],
    });
    await createWordResponse({
      name: 'apple',
      sourceUrls: ['https://en.wiktionary.org/wiki/apple'],
    });
    await createWordResponse({
      name: 'zebra',
      sourceUrls: ['https://en.wiktionary.org/wiki/zebra'],
    });

    await createUserFavoriteResponses();

    const result = await useCase.execute({ page: 1, limit: 2, offset: 1 });

    expect(result).toBeDefined();
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBe(2);
  });
});
