import { createEntity } from '../../factories';
import { WordModel } from '../../words/model/word.model';

/**
 * Creates a word with fake data
 *
 * @param overrides Optional overrides for word attributes
 * @param bulk Whether to create multiple greetings
 * @param quantity Number of greetings to create if bulk is true
 * @returns Created word(s)
 */
export const createWordResponse = async (
  overrides: Partial<WordModel> = {},
  bulk: boolean = false,
  quantity: number = 1,
) => {
  return createEntity(WordModel, overrides, bulk, quantity);
};
