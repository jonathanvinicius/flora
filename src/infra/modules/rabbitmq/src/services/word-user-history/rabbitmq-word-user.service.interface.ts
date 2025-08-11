import { Injectable } from '@nestjs/common';
import { IWordUserHistoryDTO } from './dto/word-user-history.dto';

@Injectable()
export abstract class IRabbitMqWordUserHistoryService {
  abstract emitMessage(dto: IWordUserHistoryDTO): Promise<void>;
}
