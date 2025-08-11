import { IRedisService } from '@app/infra/modules/cache';

export const createRedisServiceMock = (): jest.Mocked<IRedisService> => {
  return {
    get: jest.fn(),
    hasCache: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    clear: jest.fn().mockResolvedValue(undefined),
    createKey: jest.fn().mockImplementation((v: string) => `mock:${v}`),
    bumpVersion: jest.fn().mockResolvedValue(undefined),
  };
};
