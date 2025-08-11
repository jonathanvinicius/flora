import { IPasswordHashService } from '@app/infra/modules/password-hash/password-hash.service.interface';

export const createPasswordHashServiceMock =
  (): jest.Mocked<IPasswordHashService> => {
    return {
      comparePassword: jest.fn(),
      hashPassword: jest.fn(),
    } as jest.Mocked<IPasswordHashService>;
  };
