import { Injectable } from '@nestjs/common';
import { UserFavoriteWordDTO } from './dto/user-favorite-word.dto';

@Injectable()
export abstract class IRabbitMqUserFavoriteWord {
  abstract emitMessage(dto: UserFavoriteWordDTO): Promise<void>;
  abstract emitMessageUnfavoriteMessage(
    dto: UserFavoriteWordDTO,
  ): Promise<void>;
}
