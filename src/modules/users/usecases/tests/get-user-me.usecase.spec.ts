import { Test, TestingModule } from '@nestjs/testing';
import { ConfigMock } from '@app/infra/config/config.mock';
import { createUserResponse } from '@app/infra/database/contexts/relational/_fakers_';
import {
  UserDataModule,
  UserSearchHistoryDataModule,
} from '@app/infra/database/contexts';
import { GetUserMeUseCase } from '../get-user-me.usecase';
import { UserFavoriteWordsDataModule } from '@app/infra/database/contexts/relational/user-favorite-words';
import { WordDataModule } from '@app/infra/database/contexts/relational/words';

describe('GetUserMeUseCase', () => {
  let useCase: GetUserMeUseCase;
  let createdUser: any;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ...ConfigMock,
        UserDataModule,
        UserFavoriteWordsDataModule,
        UserSearchHistoryDataModule,
        WordDataModule,
      ],
      providers: [GetUserMeUseCase],
    }).compile();

    useCase = module.get<GetUserMeUseCase>(GetUserMeUseCase);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return user profile', async () => {
    createdUser = await createUserResponse();

    const result = await useCase.execute(createdUser.id);

    expect(result).toBeDefined();
    expect(result.email).toBe(createdUser.email);
    expect(result.id).toBe(createdUser.id);
    expect(result.name).toBe(createdUser.name);
  });
});
