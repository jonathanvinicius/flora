import { Injectable } from '@nestjs/common';
import { IDictionaryApiService } from './dictionary-api.service.interface';
import { GetWordDefinitionsDto } from './dtos';
import { GetWordDefinitionsUseCase } from './usecases';
import { DictionaryEntry } from './responses/get-definition-word.response';

@Injectable()
export class DictionaryApiService implements IDictionaryApiService {
  constructor(
    private readonly getWordDefinitionWordUseCase: GetWordDefinitionsUseCase,
  ) {}

  async getDefinitionWord(
    params: GetWordDefinitionsDto,
  ): Promise<DictionaryEntry> {
    return this.getWordDefinitionWordUseCase.execute(params);
  }
}
