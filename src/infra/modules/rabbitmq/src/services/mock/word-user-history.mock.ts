import { IRabbitMqWordUserHistoryService } from '../word-user-history/index';

export const createRabbitMqWordUserHistoryServiceMock =
  (): jest.Mocked<IRabbitMqWordUserHistoryService> => {
    return {
      emitMessage: jest.fn().mockResolvedValue(undefined),
    };
  };
