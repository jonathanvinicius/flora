import { ApiClientService } from '../index';
import { AxiosResponse } from 'axios';

export const createApiClientServiceMock = (): jest.Mocked<ApiClientService> => {
  return {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  } as any;
};

export const makeAxiosResponse = <T>(
  data: T,
  status = 200,
): AxiosResponse<T> => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config: {} as any,
});
