import { DictionaryEntryMapper } from '@app/libs/dictionary-api/src/responses/get-definition-word.response';

export interface IWordUserHistoryDTO {
  name: string;
  userId: string;
  definitionWord?: DictionaryEntryMapper;
}
