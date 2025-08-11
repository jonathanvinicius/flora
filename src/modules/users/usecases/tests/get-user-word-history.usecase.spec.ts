import { Test, TestingModule } from '@nestjs/testing';
import { ConfigMock } from '@app/infra/config/config.mock';
import { WordDataModule } from '@app/infra/database/contexts/relational/words';
import {
  createUserResponse,
  createUserSearchHistoryResponses,
  createWordResponse,
} from '@app/infra/database/contexts/relational/_fakers_';
import {
  UserDataModule,
  UserSearchHistoryDataModule,
} from '@app/infra/database/contexts';
import { UserFavoriteWordsDataModule } from '@app/infra/database/contexts/relational/user-favorite-words';
import { GetUserWordHistoryUsecase } from '../get-user-word-history.usecase';

describe('GetUserWordHistoryUsecase', () => {
  let useCase: GetUserWordHistoryUsecase;
  let createdUser: any;
  let createdWord: any;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ...ConfigMock,
        WordDataModule,
        UserDataModule,
        UserFavoriteWordsDataModule,
        UserSearchHistoryDataModule,
      ],
      providers: [GetUserWordHistoryUsecase],
    }).compile();

    useCase = module.get<GetUserWordHistoryUsecase>(GetUserWordHistoryUsecase);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return a paginated list user favorite words', async () => {
    createdUser = await createUserResponse();
    createdWord = await createWordResponse();

    await createUserSearchHistoryResponses({
      userId: createdUser.id,
      word: createdWord.name,
    });
    await createUserSearchHistoryResponses({
      userId: createdUser.id,
      word: createdWord.name,
    });

    const result = await useCase.execute(
      { page: 1, limit: 2, offset: 1 },
      createdUser.id,
    );

    expect(result).toBeDefined();
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBe(1);
  });
});
