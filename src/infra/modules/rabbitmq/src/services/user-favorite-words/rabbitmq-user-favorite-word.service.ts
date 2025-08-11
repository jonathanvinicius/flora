import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  RMQ_QUEUE_USER_FAVORITE_WORD,
  SAVE_USER_FAVORITE_WORD_PATTERN,
  SAVE_USER_UNFAVORITE_WORD_PATTERN,
} from './rabbitmq-user-favorite-word.constants';
import { IRabbitMqUserFavoriteWord } from './rabbitmq-user-favorite-word.interface';
import { RabbitMqPublisherFactory } from '../../factories/rabbitmq-publisher-factory';
import { UserFavoriteWordDTO } from './dto/user-favorite-word.dto';
import { UserUnFavoriteWordDTO } from './dto/user-unfavorite-word.dto';

@Injectable()
export class RabbitMqUserFavoriteWordService
  implements IRabbitMqUserFavoriteWord
{
  private readonly logger = new Logger(RabbitMqUserFavoriteWordService.name);
  constructor(private readonly factory: RabbitMqPublisherFactory) {}

  async emitMessage(dto: UserFavoriteWordDTO): Promise<void> {
    const publisher = this.factory.create(RMQ_QUEUE_USER_FAVORITE_WORD);

    await publisher.emit(SAVE_USER_FAVORITE_WORD_PATTERN, dto);
  }

  async emitMessageUnfavoriteMessage(dto: UserUnFavoriteWordDTO) {
    const publisher = this.factory.create(RMQ_QUEUE_USER_FAVORITE_WORD);

    await publisher.emit(SAVE_USER_UNFAVORITE_WORD_PATTERN, dto);
  }
}
