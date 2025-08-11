import { Configuration } from '@app/infra/config/configuration';
import { Injectable } from '@nestjs/common';
import {
  ClientOptions,
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class RabbitMqBuilderProxy {
  static createWordUserHistoryProxy(): ClientProxy {
    const config = Configuration.I.config.rabbitmq;
    const queue = process.env.RABBITMQ_QUEUE_WORD_USER_HISTORY;

    const clientOptions: ClientOptions = {
      transport: Transport.RMQ,
      options: {
        urls: [config.uri],
        queue: queue,
        queueOptions: {
          durable: true,
          arguments: {
            'x-dead-letter-exchange': `${config.exchange}.dlx`,
            'x-dead-letter-routing-key': queue.replace('.queue', '.dlq'),
          },
        },
      },
    };
    return ClientProxyFactory.create(clientOptions);
  }

   static createUserFavoriteWord(): ClientProxy {
    const config = Configuration.I.config.rabbitmq;
    const queue = process.env.RABBITMQ_QUEUE_WORD_USER_HISTORY;

    const clientOptions: ClientOptions = {
      transport: Transport.RMQ,
      options: {
        urls: [config.uri],
        queue: queue,
        queueOptions: {
          durable: true,
          arguments: {
            'x-dead-letter-exchange': `${config.exchange}.dlx`,
            'x-dead-letter-routing-key': queue.replace('.queue', '.dlq'),
          },
        },
      },
    };
    return ClientProxyFactory.create(clientOptions);
  }
}
