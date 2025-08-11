import { Test, TestingModule } from '@nestjs/testing';
import { ConfigMock } from '@app/infra/config/config.mock';
import { WordDataModule } from '@app/infra/database/contexts/relational/words';
import {
  createUserFavoriteResponses,
  createUserResponse,
} from '@app/infra/database/contexts/relational/_fakers_';
import { UserDataModule } from '@app/infra/database/contexts';
import { UserFavoriteWordsDataModule } from '@app/infra/database/contexts/relational/user-favorite-words';
import { GetUserFavoriteWordsUseCase } from '../get-user-favorite-words.usecase';

describe('GetUserFavoriteWordsUseCase', () => {
  let useCase: GetUserFavoriteWordsUseCase;
  let createdUser: any;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ...ConfigMock,
        WordDataModule,
        UserDataModule,
        UserFavoriteWordsDataModule,
      ],
      providers: [GetUserFavoriteWordsUseCase],
    }).compile();

    useCase = module.get<GetUserFavoriteWordsUseCase>(
      GetUserFavoriteWordsUseCase,
    );
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return a paginated list user favorite words', async () => {
    createdUser = await createUserResponse();
    await createUserFavoriteResponses({ userId: createdUser.id });
    await createUserFavoriteResponses({ userId: createdUser.id });
    await createUserFavoriteResponses({ userId: createdUser.id });

    const result = await useCase.execute(
      { page: 1, limit: 2, offset: 1 },
      createdUser.id,
    );

    expect(result).toBeDefined();
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBe(2);
  });
});
