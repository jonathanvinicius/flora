import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { db, jwt, redis } from '../factories';
import { IAppConfig } from '../interfaces';
import { Configuration } from './configuration';
import { rabbitmq } from '../factories/index';
import { rabbitMqWordUserHistory } from '../factories/rabbitmq-builder-word-user-history.config';

const logger = new Logger('LoadConfig');

// Load environment variables
dotenv.config();

/**
 * Initialize `Configuration` with environment variables
 */
export async function loadConfig() {
  logger.log('Loading config ' + process.env.NODE_ENV + ' ...');

  const dbCredentials = await db();

  //const appConfig = app();
  const jwtConfig = jwt();
  const redisConfig = redis();

  const appData: IAppConfig = {
    rabbitmq: rabbitmq(),
    db: dbCredentials,
    jwt: jwtConfig,
    services: {
      wordUserHistory: rabbitMqWordUserHistory(),
    },
    redis: redisConfig,
  };
  // Set config
  Configuration.load(appData);
  return appData;
}
