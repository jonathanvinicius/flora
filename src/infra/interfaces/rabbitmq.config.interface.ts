import { RmqUrl } from '@nestjs/microservices/external/rmq-url.interface';

export interface QueueConfigInterface {
  queue: string;
  patterns: string[];
  alias?: string;
}

/**
 * Rabbit MQ config and queues
 */
export interface IRabbitMqConfig extends RmqUrl {
  username: string;
  password: string;
  hostname: string;
  port: number;
  vhost: string;
  /**
   * Exchange type: direct
   */
  exchange: string;
  /**
   * Queue
   */
  queue?: QueueConfigInterface;
  consumerQueues?: QueueConfigInterface[];
  publisherQueues?: QueueConfigInterface[];

  /**
   * DLQ
   */
  deadLetterQueue?: string;
  /**
   * Queues
   */
  queues: string[];

  get uri(): string;
}
