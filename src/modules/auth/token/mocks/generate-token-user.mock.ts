import { IGenerateTokenUser } from '../generate-token-user.inteface';

export const createGenerateTokenUserMock =
  (): jest.Mocked<IGenerateTokenUser> => {
    return {
      generateToken: jest.fn(),
    } as jest.Mocked<IGenerateTokenUser>;
  };
