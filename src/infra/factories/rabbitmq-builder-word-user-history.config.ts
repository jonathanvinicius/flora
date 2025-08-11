import { SAVE_WORD_USER_HISTORY_PATTERN } from '@app/infra/modules/rabbitmq/src/services/word-user-history';
import { BaseRabbitMQMicroserviceTemplate } from '../modules/rabbitmq/src/templates/rabbitmq-microservice.template';
import { QueueAlias } from './rabbitmq.config';
import { registerAs } from '@nestjs/config';
import {
  SAVE_USER_FAVORITE_WORD_PATTERN,
  SAVE_USER_UNFAVORITE_WORD_PATTERN,
} from '../modules/rabbitmq/src/services/user-favorite-words';

export class WordUserHistoryRabbitMq extends BaseRabbitMQMicroserviceTemplate {
  constructor() {
    super(
      process.env.RABBITMQ_EXCHANGE,
      process.env.RABBITMQ_QUEUE_WORD_USER_HISTORY,
      [
        SAVE_WORD_USER_HISTORY_PATTERN,
        SAVE_USER_FAVORITE_WORD_PATTERN,
        SAVE_USER_UNFAVORITE_WORD_PATTERN,
      ],
    );
  }
}

export const rabbitMqWordUserHistory = registerAs(
  QueueAlias.WORD_USER_HISTORY_QUEUE,
  () => new WordUserHistoryRabbitMq(),
);
