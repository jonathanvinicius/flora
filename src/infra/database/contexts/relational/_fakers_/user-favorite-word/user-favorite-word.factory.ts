import { createEntity } from '../../factories';
import { UserFavoriteWordModel } from '../../user-favorite-words/model/user-favorite-word.model';
import { createUserResponse } from '../users/user-responses.factory';
import { createWordResponse } from '../words/word-responses.factory';

/**
 * Creates a word favorite with fake data
 *
 * @param overrides Optional overrides for word favorite attributes
 * @param bulk Whether to create multiple greetings
 * @param quantity Number of greetings to create if bulk is true
 * @returns Created word favorite(s)
 */
export const createUserFavoriteResponses = async (
  overrides: Partial<UserFavoriteWordModel> = {},
  bulk: boolean = false,
  quantity: number = 1,
) => {
  let word: any;
  let user: any;

  if (!overrides.wordId) {
    word = await createWordResponse();
  }

  if (!overrides.userId) {
    user = await createUserResponse();
  }

  const userFavoriteResponseData = {
    wordId: word?.id || overrides.wordId,
    userId: user?.id || overrides.userId,
    ...overrides,
  };

  return createEntity(
    UserFavoriteWordModel,
    userFavoriteResponseData,
    bulk,
    quantity,
  );
};
