import { Module } from '@nestjs/common';
import { RabbitMqService } from './rabbitmq.service';
import { IRabbitMqService } from './rabbitmq.service.interface';

import {
  RabbitMqWordUserHistoryService,
  IRabbitMqWordUserHistoryService,
  RMQ_QUEUE_WORD_USER_HISTORY,
} from './services/word-user-history';
import { ConfigModule } from '@nestjs/config';
import { RabbitMqBuilderProxy } from './factories/rabbitmq-builder.proxy';
import { RabbitMqPublisherFactory } from './factories/rabbitmq-publisher-factory';
import {
  IRabbitMqUserFavoriteWord,
  RabbitMqUserFavoriteWordService,
  RMQ_QUEUE_USER_FAVORITE_WORD,
} from './services/user-favorite-words';

@Module({
  imports: [ConfigModule],
  providers: [
    RabbitMqPublisherFactory,
    {
      provide: IRabbitMqService,
      useClass: RabbitMqService,
    },
    {
      provide: IRabbitMqWordUserHistoryService,
      useClass: RabbitMqWordUserHistoryService,
    },
    {
      provide: IRabbitMqUserFavoriteWord,
      useClass: RabbitMqUserFavoriteWordService,
    },
    {
      provide: RMQ_QUEUE_WORD_USER_HISTORY,
      useFactory: () => RabbitMqBuilderProxy.createWordUserHistoryProxy(),
    },
    {
      provide: RMQ_QUEUE_USER_FAVORITE_WORD,
      useFactory: () => RabbitMqBuilderProxy.createUserFavoriteWord(),
    },
  ],
  exports: [
    IRabbitMqService,
    IRabbitMqWordUserHistoryService,
    RabbitMqPublisherFactory,
    IRabbitMqUserFavoriteWord,
  ],
})
export class RabbitMqModule {}
