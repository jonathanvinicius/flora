import { createEntity } from '../../factories';
import { UserSearchHistoryModel } from '../../user-search-history/model/user-search-history.model';
import { createUserResponse } from '../users/user-responses.factory';

/**
 * Creates a user search history with fake data
 *
 * @param overrides Optional overrides for user search history  attributes
 * @param bulk Whether to create multiple greetings
 * @param quantity Number of greetings to create if bulk is true
 * @returns Created user search history
 */
export const createUserSearchHistoryResponses = async (
  overrides: Partial<UserSearchHistoryModel> = {},
  bulk: boolean = false,
  quantity: number = 1,
) => {
  let user: any;

  if (!overrides.userId) {
    user = await createUserResponse();
  }

  const userFavoriteResponseData = {
    userId: user?.id || overrides.userId,
    ...overrides,
  };

  return createEntity(
    UserSearchHistoryModel,
    userFavoriteResponseData,
    bulk,
    quantity,
  );
};
