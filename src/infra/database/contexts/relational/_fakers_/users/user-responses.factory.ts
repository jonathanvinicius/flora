import { createEntity } from '../../factories';
import { UserModel } from '../../users/model/user.model';

/**
 * Creates a user with fake data
 *
 * @param overrides Optional overrides for user attributes
 * @param bulk Whether to create multiple greetings
 * @param quantity Number of greetings to create if bulk is true
 * @returns Created user(s)
 */
export const createUserResponse = async (
  overrides: Partial<UserModel> = {},
  bulk: boolean = false,
  quantity: number = 1,
) => {
  return createEntity(UserModel, overrides, bulk, quantity);
};
