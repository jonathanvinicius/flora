import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IServiceRabbitMqConfig } from './infra/interfaces/services-rabbitmq-interface';
import {
  AcceptableExchanges,
  RabbitMqConfigManager,
} from './infra/modules/rabbitmq/src/templates/rabbitmq-config.manager';
import { IRabbitMqConfig } from './infra/interfaces/rabbitmq.config.interface';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly rabbitMqConfigManager: RabbitMqConfigManager,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    try {
      this.logger.debug('Setup Rabbitmq start');
      const services =
        this.configService.get<IServiceRabbitMqConfig>('services');

      const rmqConfig = this.configService.get<IRabbitMqConfig>(
        'rabbitmq',
      ) as IRabbitMqConfig;

      const defaultExchange = rmqConfig.exchange;

      const dlxEchange = defaultExchange + '.dlx';

      const servicesList = Object.values(services);

      await Promise.all(
        servicesList.map(async (ms) => {
          const { patterns, queueName, queueArguments } = ms;
          const dlq = `${queueName.replace('.queue', '.dlq')}`;

          await this.rabbitMqConfigManager.buildConnection({
            deadLetterExchangeName: dlxEchange,
            deadLetterExchangeType: AcceptableExchanges.DIRECT,
            deadLetterExchangeOptions: { durable: true },
            deadLetterQueueName: dlq,
            deadLetterOptions: { durable: true },
            deadLetterQueuePattern: dlq,
            exchangeName: defaultExchange,
            exchangeType: AcceptableExchanges.DIRECT,
            exchangeOptions: {
              durable: true,
            },
            queueName: queueName,
            queueOptions: {
              durable: true,
              arguments: queueArguments,
            },
            queuePatterns: patterns,
          });
        }),
      );

      this.logger.debug('Setup Rabbitmq finish');
    } catch (error) {
      this.logger.error('Failed Setup Rabbitmq ...' + error.message);
    }
  }
}
