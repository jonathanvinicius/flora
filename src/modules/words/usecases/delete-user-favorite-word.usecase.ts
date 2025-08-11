import {
  IUsecase,
  IUSER_FAVORITE_WORDS_REPOSITORY,
  IUserFavoriteWordRepository,
  IWORD_REPOSITORY,
  IWordRepository,
} from '@app/domain';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DeleteUserFavoriteDto } from '../dtos';
import { IRabbitMqUserFavoriteWord } from '@app/infra/modules/rabbitmq/src/services/user-favorite-words';
import { ErrorDefinitions } from '@app/domain/errors';
import { WordModel } from '@app/infra/database/contexts/relational/words/model/word.model';

@Injectable()
export class DeleteUserFavoriteWordUseCase implements IUsecase {
  constructor(
    @Inject(IWORD_REPOSITORY)
    private readonly wordRepository: IWordRepository,
    @Inject(IUSER_FAVORITE_WORDS_REPOSITORY)
    private readonly userFavoriteWordRepository: IUserFavoriteWordRepository,
    private readonly rabbitMqUserFavoriteWord: IRabbitMqUserFavoriteWord,
  ) {}
  async execute(param: DeleteUserFavoriteDto, userId: string): Promise<void> {
    const word = await this.wordRepository.findOne({
      where: { name: param.word },
    });

    if (!word) {
      throw new NotFoundException({
        errorDefinition: ErrorDefinitions.WORD_NOT_FOUND,
      });
    }

    const userFavoriteWord = await this.userFavoriteWordRepository.findOne({
      where: { userId },
      include: [
        {
          model: WordModel,
          attributes: ['name'],
          where: { name: param.word },
          required: true,
        },
      ],
    });

    if (!userFavoriteWord) {
      throw new NotFoundException({
        errorDefinition: ErrorDefinitions.WORD_NOT_FOUND,
      });
    }

    await this.rabbitMqUserFavoriteWord.emitMessageUnfavoriteMessage({
      wordId: word.id,
      userId,
    });
  }
}
