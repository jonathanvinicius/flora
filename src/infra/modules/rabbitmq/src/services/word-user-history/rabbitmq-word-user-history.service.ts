import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  SAVE_WORD_USER_HISTORY_PATTERN,
  RMQ_QUEUE_WORD_USER_HISTORY,
} from './rabbitmq-word-user-history.constants';
import { IWordUserHistoryDTO } from './dto/word-user-history.dto';
import { IRabbitMqWordUserHistoryService } from './rabbitmq-word-user.service.interface';
import { RabbitMqPublisherFactory } from '../../factories/rabbitmq-publisher-factory';

@Injectable()
export class RabbitMqWordUserHistoryService
  implements IRabbitMqWordUserHistoryService
{
  private readonly logger = new Logger(RabbitMqWordUserHistoryService.name);
  constructor(private readonly factory: RabbitMqPublisherFactory) {}

  async emitMessage(dto: IWordUserHistoryDTO): Promise<void> {
    const publisher = this.factory.create(RMQ_QUEUE_WORD_USER_HISTORY);

    await publisher.emit(SAVE_WORD_USER_HISTORY_PATTERN, dto);
  }
}
