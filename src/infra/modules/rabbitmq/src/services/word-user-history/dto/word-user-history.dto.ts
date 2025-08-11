import { DictionaryEntry } from '@app/libs/dictionary-api/src/responses/get-definition-word.response';

export interface IWordUserHistoryDTO {
  word: string;
  userId: string;
  definitionWord?: DictionaryEntry;
}
