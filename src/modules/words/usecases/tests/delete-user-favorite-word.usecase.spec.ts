import { Test, TestingModule } from '@nestjs/testing';
import { ConfigMock } from '@app/infra/config/config.mock';
import { WordDataModule } from '@app/infra/database/contexts/relational/words';
import { UserDataModule } from '@app/infra/database/contexts';
import { UserFavoriteWordsDataModule } from '@app/infra/database/contexts/relational/user-favorite-words';
import { IRabbitMqUserFavoriteWord } from '@app/infra/modules/rabbitmq/src/services/user-favorite-words';
import {
  createUserFavoriteResponses,
  createUserResponse,
  createWordResponse,
} from '@app/infra/database/contexts/relational/_fakers_';
import { DeleteUserFavoriteWordUseCase } from '../delete-user-favorite-word.usecase';
import { NotFoundException } from '@nestjs/common';

describe('DeleteUserFavoriteWordUseCase', () => {
  let moduleRef: TestingModule;
  let useCase: DeleteUserFavoriteWordUseCase;
  let createdUser: any;

  const rabbitMock: IRabbitMqUserFavoriteWord = {
    emitMessageUnfavoriteMessage: jest.fn().mockResolvedValue(undefined),
  } as any;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ...ConfigMock,
        WordDataModule,
        UserDataModule,
        UserFavoriteWordsDataModule,
      ],
      providers: [
        DeleteUserFavoriteWordUseCase,
        { provide: IRabbitMqUserFavoriteWord, useValue: rabbitMock },
      ],
    }).compile();

    useCase = moduleRef.get(DeleteUserFavoriteWordUseCase);
    createdUser = await createUserResponse();
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

  it('should publish unfavorite message when user has that favorite', async () => {
    let word: any;
    let userFavorite: any;

    word = await createWordResponse({
      name: 'hungry',
      sourceUrls: ['https://en.wiktionary.org/wiki/hungry'],
    });
    userFavorite = await createUserFavoriteResponses({
      wordId: word.id,
      userId: createdUser.id,
    });

    await useCase.execute({ word: 'hungry' }, userFavorite.userId);

    expect(rabbitMock.emitMessageUnfavoriteMessage).toHaveBeenCalledTimes(1);
    expect(rabbitMock.emitMessageUnfavoriteMessage).toHaveBeenCalledWith({
      wordId: word.id,
      userId: userFavorite.userId,
    });
  });

  it('should throw NotFoundException when the user does not have this favorite', async () => {
    await createWordResponse({
      name: 'apple',
      sourceUrls: ['https://en.wiktionary.org/wiki/apple'],
    });

    await expect(
      useCase.execute({ word: 'apple' }, createdUser.id),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(rabbitMock.emitMessageUnfavoriteMessage).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when the word does not exist', async () => {
    await expect(
      useCase.execute({ word:'not_exits' }, createdUser.id),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(rabbitMock.emitMessageUnfavoriteMessage).not.toHaveBeenCalled();
  });
});
