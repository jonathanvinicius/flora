import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigMock } from '@app/infra/config/config.mock';
import { WordDataModule } from '@app/infra/database/contexts/relational/words';
import { UserDataModule } from '@app/infra/database/contexts';
import { UserFavoriteWordsDataModule } from '@app/infra/database/contexts/relational/user-favorite-words';
import { IRabbitMqUserFavoriteWord } from '@app/infra/modules/rabbitmq/src/services/user-favorite-words';
import {
  createUserFavoriteResponses,
  createWordResponse,
} from '@app/infra/database/contexts/relational/_fakers_';
import { PostUserFavoriteWordUseCase } from '../post-user-favorite-word.usecase';

describe('PostUserFavoriteWordUseCase', () => {
  let module: TestingModule;
  let useCase: PostUserFavoriteWordUseCase;
  let createdWord: any;
  let createdFavorite: any;

  const rabbitMock: IRabbitMqUserFavoriteWord = {
    emitMessage: jest.fn().mockResolvedValue(undefined),
  } as any;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ...ConfigMock,
        WordDataModule,
        UserDataModule,
        UserFavoriteWordsDataModule,
      ],
      providers: [
        PostUserFavoriteWordUseCase,
        { provide: IRabbitMqUserFavoriteWord, useValue: rabbitMock },
      ],
    }).compile();

    useCase = module.get<PostUserFavoriteWordUseCase>(
      PostUserFavoriteWordUseCase,
    );
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

  it('should publish a message when the word exists and is not yet a user favorite', async () => {
    createdFavorite = await createUserFavoriteResponses();
    createdWord = await createWordResponse({
      name: 'hungry',
      sourceUrls: ['https://en.wiktionary.org/wiki/hungry'],
    });

    await useCase.execute({ word: 'hungry' }, createdFavorite.userId);

    expect(rabbitMock.emitMessage).toHaveBeenCalledTimes(1);
    expect(rabbitMock.emitMessage).toHaveBeenCalledWith({
      wordId: createdWord.id,
      userId: createdFavorite.userId,
    });
  });

  it('should throw UnprocessableEntityException when the word is already a user favorite', async () => {
    let createdFavorite: any;
    let createdWord: any;

    createdFavorite = await createUserFavoriteResponses();
    createdWord = await createWordResponse({
      name: 'already-favorited',
      sourceUrls: ['https://en.wiktionary.org/wiki/already-favorited'],
    });

    await createUserFavoriteResponses({
      userId: createdFavorite.userId,
      wordId: createdWord.id,
    });

    await expect(
      useCase.execute({ word: createdWord.name }, createdFavorite.userId),
    ).rejects.toBeInstanceOf(UnprocessableEntityException);

    expect(rabbitMock.emitMessage).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when the word does not exist', async () => {
    createdFavorite = await createUserFavoriteResponses();

    await expect(
      useCase.execute({ word: '__does_not_exist__' }, createdFavorite.userId),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(rabbitMock.emitMessage).not.toHaveBeenCalled();
  });
});
