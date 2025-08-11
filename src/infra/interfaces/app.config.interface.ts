import { ISequelizeConfig } from './db.config.interface';
import { IJWTConfig } from './jwt.config.interface';
import { IRabbitMqConfig } from './rabbitmq.config.interface';
import { IRedisConfig } from './redis.config.interface';
import { IServiceRabbitMqConfig } from './services-rabbitmq-interface';

/**
 * App Config
 *
 * Encapsulates environment variables
 *
 */
export interface IAppConfig {
  db: ISequelizeConfig;
  rabbitmq?: IRabbitMqConfig;
  jwt: IJWTConfig;
  services: IServiceRabbitMqConfig;
  redis: IRedisConfig;
}
