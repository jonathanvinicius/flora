import { IRabbitMqUserFavoriteWord } from '../user-favorite-words';

export const createRabbitMqUserFavoriteWordMock =
  (): jest.Mocked<IRabbitMqUserFavoriteWord> => {
    return {
      emitMessage: jest.fn().mockResolvedValue(undefined),
      emitMessageUnfavoriteMessage: jest.fn().mockResolvedValue(undefined),
    };
  };
