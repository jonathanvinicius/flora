import { ServerRMQ } from '@nestjs/microservices';
import {
  IRabbitMqConfig,
  QueueConfigInterface,
} from '@app/infra/interfaces/rabbitmq.config.interface';
import { QueueAlias } from '@app/infra/factories/rabbitmq.config';
import { RabbitMqCustomServer } from './rabbitmq-customer-server';

export abstract class BaseRabbitMQMicroserviceTemplate {
  protected constructor(
    public readonly exchangeName: string,
    public readonly queueName: string,
    public readonly patterns: string[],
    public readonly queueArguments?: Record<string, any>,
  ) {
    const args = Object.assign(
      {},
      queueArguments,
      this.getDefaultQueueOptions(queueName, exchangeName),
    );
    this.queueArguments = args;
  }

  public builder(rabbitMq: IRabbitMqConfig): ServerRMQ {
    const uri = rabbitMq.uri;
    const exchangeName = rabbitMq.exchange;

    return new RabbitMqCustomServer({
      exchange: exchangeName,
      uri: uri,
      queue: this.queueName,
      queueArguments: this.queueArguments,
    });
  }

  public asQueueConfig(alias: QueueAlias): QueueConfigInterface {
    return {
      queue: this.queueName,
      alias,
      patterns: this.patterns,
    };
  }

  protected getDefaultQueueOptions(queueName: string, exchangeName: string) {
    const queue = `${queueName.replace('.queue', '')}.dlq`;

    const defaultArgs = {
      'x-dead-letter-exchange': `${exchangeName}.dlx`,
      'x-dead-letter-routing-key': queue,
    };

    const queueArguments =
      this.queueArguments === null
        ? undefined
        : this.queueArguments ?? defaultArgs;

    return {
      durable: true,
      socketOptions: {
        heartbeatIntervalInSeconds: 60,
        enableHeartBeat: true,
        enableReadyCheck: true,
        reconnectTimeInSeconds: 5,
      },
      persistent: true,
      noAssert: false,
      ...queueArguments,
    };
  }
}
