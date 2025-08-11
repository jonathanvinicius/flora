import { Injectable } from '@nestjs/common';
import { GetWordDefinitionsDto } from './dtos';
import { DictionaryEntryMapper } from './responses/get-definition-word.response';

@Injectable()
export abstract class IDictionaryApiService {
  /**
   * Get definition word
   */
  abstract getDefinitionWord(
    params: GetWordDefinitionsDto,
  ): Promise<DictionaryEntryMapper>;
}
