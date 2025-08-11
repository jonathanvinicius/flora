import { IRabbitMqConfig } from '@app/infra/interfaces/rabbitmq.config.interface';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';

export const enum AcceptableExchanges {
  DIRECT = 'direct',
  FANOUT = 'fanout',
  TOPIC = 'topic',
  X_DELAYED_MESSAGE = 'x-delayed-message',
}

export type ExchangeOptions = {
  durable?: boolean;
  arguments?:
    | {
        'x-delayed-message': 'direct' | 'topic' | 'fanout';
      }
    | Record<string, any>;
};

export type QueueOptions = {
  durable?: boolean;
  arguments?:
    | {
        'x-dead-letter-exchange': string;
        'x-dead-letter-routing-key': string;
      }
    | Record<string, any>;
};

@Injectable()
export class RabbitMqConfigManager {
  private readonly logger = new Logger(RabbitMqConfigManager.name);
  private readonly rmqConfig: IRabbitMqConfig;
  private readonly channelWrapper: ChannelWrapper;

  public constructor(private readonly config: ConfigService) {
    this.rmqConfig = this.config.get<IRabbitMqConfig>(
      'rabbitmq',
    ) as IRabbitMqConfig;
    const connection = amqp.connect([this.rmqConfig]);
    this.channelWrapper = connection.createChannel();
  }

  public async createQueue(params: {
    queueName: string;
    options: QueueOptions;
  }): Promise<void> {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        const { queueName, options } = params;

        await channel.assertQueue(queueName, options);
      });
    } catch (error: any) {
      this.logger.error('Failed to create queue: ' + error.message);
      throw error;
    }
  }

  public async createExchange(params: {
    exchangeName: string;
    exchangeType: AcceptableExchanges | string;
    options: ExchangeOptions;
  }): Promise<void> {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        const { exchangeName, exchangeType, options } = params;
        await channel.assertExchange(exchangeName, exchangeType, options);
      });
    } catch (error: any) {
      this.logger.error('Failed to create exchange: ' + error.message);
      throw error;
    }
  }

  public async bindQueue(params: {
    queueName: string;
    exchangeName: string;
    pattern: string;
  }): Promise<void> {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        const { queueName, exchangeName, pattern } = params;
        await channel.bindQueue(queueName, exchangeName, pattern);
      });
    } catch (error) {
      this.logger.error('Failed to bind queue: ' + error.message);
      throw error;
    }
  }

  private async bindPatternsToAppQueue(
    defaultPatterns: string[],
    exchangeName: string,
    queueName: string,
  ) {
    await Promise.all(
      defaultPatterns.map(async (pattern) => {
        await this.bindQueue({
          exchangeName,
          queueName,
          pattern,
        });
      }),
    );
  }

  public async buildConnection(builder: {
    deadLetterExchangeName: string;
    deadLetterExchangeType: AcceptableExchanges;
    deadLetterExchangeOptions: Record<string, any>;
    deadLetterQueueName: string;
    deadLetterOptions: Record<string, any>;
    deadLetterQueuePattern: string;
    exchangeName: string;
    exchangeType: AcceptableExchanges;
    exchangeOptions: Record<string, any>;
    queueName: string;
    queueOptions: Record<string, any>;
    queuePatterns: string[];
  }): Promise<void> {
    try {
      // assert dlx
      await this.createExchange({
        exchangeName: builder.deadLetterExchangeName,
        exchangeType: builder.deadLetterExchangeType,
        options: builder.deadLetterExchangeOptions,
      });

      // assert dlq
      await this.createQueue({
        queueName: builder.deadLetterQueueName,
        options: builder.deadLetterOptions,
      });

      // bind dlq to dlx
      await this.bindQueue({
        exchangeName: builder.deadLetterExchangeName,
        queueName: builder.deadLetterQueueName,
        pattern: builder.deadLetterQueuePattern,
      });

      // assert  exchange
      await this.createExchange({
        exchangeName: builder.exchangeName,
        exchangeType: builder.exchangeType,
        options: builder.exchangeOptions,
      });

      // assert queue
      await this.createQueue({
        queueName: builder.queueName,
        options: builder.queueOptions,
      });

      // bind queue to exchange
      await this.bindPatternsToAppQueue(
        builder.queuePatterns,
        builder.exchangeName,
        builder.queueName,
      );
    } catch (error) {}
  }
}
