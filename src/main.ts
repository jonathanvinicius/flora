import * as dotenv from 'dotenv';
dotenv.config();

import { loadConfig } from './infra/config/load.config';
import { Configuration } from './infra/config/configuration';

const envConfig = loadConfig();
Configuration.load(envConfig);

import { NestFactory } from '@nestjs/core';

import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
// import { initializeMiddlewares } from './middlewares';
import { SwaggerDoc } from './modules/docs/swagger.doc';
import { FilterExceptionInterceptor } from './infra/interceptors';
import { CustomValidation } from './shared';

//logger
const logger = new Logger('CoreMain');

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    });

    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    });
    app.useGlobalFilters(app.get(FilterExceptionInterceptor));
    app.useGlobalPipes(new CustomValidation());
    new SwaggerDoc().setupDocs(app);

    const port = Number(process.env.API_PORT) || 3000;
    await app.listen(port);
    logger.log(
      `APP Core running port ${port} environment: ${process.env.NODE_ENV}`,
    );

    const { rabbitmq, services } = Configuration.I.config;
    const { hostname, consumerQueues, publisherQueues } = rabbitmq;

    Object.values(services).forEach((service) => {
      app.connectMicroservice({ strategy: service.builder(rabbitmq) });
    });

    app.init();

    await app.startAllMicroservices();
    
    logger.log(`RabbitMQ host: ${hostname}`);
    if (consumerQueues.length) {
      logger.log(
        `RabbitMQ consumer queues: ${consumerQueues.map((q) => q.queue)}`,
      );
    }
    if (publisherQueues.length) {
      logger.log(
        `RabbitMQ producer queues: ${publisherQueues.map((q) => q.queue)}`,
      );
    }
    if (process.env.APP_SERVER_URL)
      logger.log(`Application server: ${process.env.APP_SERVER_URL}`);
  } catch (e) {
    console.error('Bootstrap failed:', e);
    process.exit(1);
  }
}
bootstrap();
