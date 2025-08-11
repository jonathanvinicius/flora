import { registerAs } from '@nestjs/config';
import {
  IRabbitMqConfig,
  QueueConfigInterface,
} from '../interfaces/rabbitmq.config.interface';

import { WordUserHistoryRabbitMq } from './rabbitmq-builder-word-user-history.config';

export const enum QueueAlias {
  WORD_USER_HISTORY_QUEUE = 'word-user.queue',
}

class RabbitMqConfig implements IRabbitMqConfig {
  username: string;
  password: string;
  hostname: string;
  port: number;
  vhost: string;
  exchange: string;
  queue?: QueueConfigInterface;
  queues: string[];
  consumerQueues?: QueueConfigInterface[];
  publisherQueues?: QueueConfigInterface[];
  /**
   * Create Rabbitmq config
   */
  constructor() {
    this.username = process.env.RABBITMQ_USERNAME;
    this.password = process.env.RABBITMQ_PASSWORD;
    this.hostname = process.env.RABBITMQ_HOST;
    this.port = +process.env.RABBITMQ_PORT;
    /**
     * Virtual host
     */
    this.vhost = process.env.RABBITMQ_VIRTUAL_HOST;
    this.exchange = process.env.RABBITMQ_EXCHANGE ?? '';
    this.queue = null;
    this.publisherQueues = [];
    this.consumerQueues = [
      new WordUserHistoryRabbitMq().asQueueConfig(
        QueueAlias.WORD_USER_HISTORY_QUEUE,
      ),
    ];
    this.queues = [process.env.RABBITMQ_QUEUE_WORD_USER_HISTORY];
  }
  deadLetterQueue?: string;

  get heartbeat(): number {
    return 60;
  }

  protocol?: string;
  locale?: string;
  frameMax?: number;

  /**
   * Connection string amqp
   */
  get uri() {
    return `amqp://${this.username}:${this.password}@${this.hostname}:${this.port}/${this.vhost}`;
  }

  getQueueByAlias(alias: QueueAlias): QueueConfigInterface | null {
    if (!alias) {
      return null;
    }
    const consumerQueue = this.consumerQueues?.find(
      (queue) => queue.alias === alias,
    );

    if (consumerQueue) {
      return consumerQueue;
    }

    const publisherQueue = this.publisherQueues?.find(
      (queue) => queue.alias === alias,
    );

    if (publisherQueue) {
      return publisherQueue as QueueConfigInterface;
    }
  }
}

/**
 * Register `rabbimq` over environment
 */
export default registerAs('rabbitmq', () => {
  const rabbitMqConfig = new RabbitMqConfig();
  return rabbitMqConfig;
});
