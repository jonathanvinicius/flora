import { Test, TestingModule } from '@nestjs/testing';
import { GetWordDefinitionsUseCase } from '../get-word-definitions.usecase';
import { ConfigMock } from '@app/infra/config/config.mock';
import { WordDataModule } from '@app/infra/database/contexts/relational/words';
import { createWordResponse } from '@app/infra/database/contexts/relational/_fakers_';
import { IDictionaryApiService } from '@app/libs/dictionary-api/src/dictionary-api.service.interface';
import { IRabbitMqWordUserHistoryService } from '@app/infra/modules/rabbitmq/src/services/word-user-history';
import { createDictionaryApiServiceMock } from '@app/libs/dictionary-api/src/mocks';
import { createRabbitMqWordUserHistoryServiceMock } from '@app/infra/modules/rabbitmq/src/services/mock';
import { UserFavoriteWordsDataModule } from '@app/infra/database/contexts/relational/user-favorite-words';
import { UserDataModule } from '@app/infra/database/contexts';

describe('GetWordDefinitionsUseCase', () => {
  let module: TestingModule;
  let useCase: GetWordDefinitionsUseCase;

  const dictionaryApiMock = createDictionaryApiServiceMock();

  const rabbitMock = createRabbitMqWordUserHistoryServiceMock();

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ...ConfigMock,
        WordDataModule,
        UserFavoriteWordsDataModule,
        UserDataModule,
      ],
      providers: [
        GetWordDefinitionsUseCase,
        { provide: IDictionaryApiService, useValue: dictionaryApiMock },
        { provide: IRabbitMqWordUserHistoryService, useValue: rabbitMock },
      ],
    }).compile();

    useCase = module.get(GetWordDefinitionsUseCase);
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

  it('returns DB word and emits history when word is completed', async () => {
    await createWordResponse({
      name: 'hungry',
      isCompleted: true,
      sourceUrls: ['https://en.wiktionary.org/wiki/hungry'],
    });

    const result = await useCase.execute({ word: 'Hungry' }, 'user-1');

    expect(result).toBeTruthy();
    expect(result.name).toBeDefined();
    expect(rabbitMock.emitMessage).toHaveBeenCalledWith(
      expect.objectContaining({ word: 'Hungry', userId: 'user-1' }),
    );
    expect(dictionaryApiMock.getDefinitionWord).not.toHaveBeenCalled();
  });

  it('calls external API, emits history with definition, and returns API result when word not in DB', async () => {
    const api = await dictionaryApiMock.getDefinitionWord({ word: 'banana' });

    dictionaryApiMock.getDefinitionWord.mockResolvedValueOnce(api);

    const result = await useCase.execute({ word: 'banana' }, 'user-2');

    expect(dictionaryApiMock.getDefinitionWord).toHaveBeenCalledWith({
      word: 'banana',
    });
    expect(result).toEqual(api);
    expect(rabbitMock.emitMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        word: 'banana',
        userId: 'user-2',
        definitionWord: api,
      }),
    );
  });
});
