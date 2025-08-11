import {
  IUsecase,
  IUserSearchHistoryRepository,
  IUSER_SEARCH_HISTORY_REPOSITORY,
  IWordRepository,
  IWORD_REPOSITORY,
} from '@app/domain';
import { Inject, Injectable } from '@nestjs/common';
import { GetWordDefinitionsDto } from '../dtos';
import { IDictionaryApiService } from '@app/libs/dictionary-api/src/dictionary-api.service.interface';
import { IRabbitMqWordUserHistoryService } from '@app/infra/modules/rabbitmq/src/services/word-user-history';
import { GetWordDefinitionsResponse } from '../responses';
import { DictionaryEntry } from '@app/libs/dictionary-api/src/responses/get-definition-word.response';

@Injectable()
export class GetWordDefinitionsUseCase implements IUsecase {
  constructor(
    private readonly dictionaryApiService: IDictionaryApiService,
    private readonly rabbitMqWordUserHistory: IRabbitMqWordUserHistoryService,
    @Inject(IWORD_REPOSITORY)
    private readonly wordRepository: IWordRepository,
  ) {}

  async execute(
    params: GetWordDefinitionsDto,
    userId: string,
  ): Promise<GetWordDefinitionsResponse> {
    const word = await this.wordRepository.findOne({
      where: { name: params.word.toLowerCase(), isCompleted: true },
      attributes: ['name', 'phonetics', 'meanings', 'sourceUrls'],
    });

    if (word) {
      await this.registerUserHistory(params.word, userId);
      return word;
    }

    const dictionary = await this.dictionaryApiService.getDefinitionWord(
      params,
    );

    await this.registerUserHistory(dictionary.word, userId, dictionary);

    return dictionary;
  }

  private async registerUserHistory(
    word: string,
    userId: string,
    definitionWord?: DictionaryEntry,
  ): Promise<void> {
    await this.rabbitMqWordUserHistory.emitMessage({
      word,
      userId,
      definitionWord,
    });
  }
}
