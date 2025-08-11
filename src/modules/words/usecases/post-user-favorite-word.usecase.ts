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
import { PostUserFavoriteDto } from '../dtos';
import { IRabbitMqUserFavoriteWord } from '@app/infra/modules/rabbitmq/src/services/user-favorite-words';
import { WordModel } from '@app/infra/database/contexts/relational/words/model/word.model';
import { ErrorDefinitions } from '@app/domain/errors';

@Injectable()
export class PostUserFavoriteWordUseCase implements IUsecase {
  constructor(
    @Inject(IWORD_REPOSITORY)
    private readonly wordRepository: IWordRepository,
    @Inject(IUSER_FAVORITE_WORDS_REPOSITORY)
    private readonly userFavoriteWordRepository: IUserFavoriteWordRepository,
    private readonly rabbitMqUserFavoriteWord: IRabbitMqUserFavoriteWord,
  ) {}
  async execute(param: PostUserFavoriteDto, userId: string): Promise<void> {
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

    if (userFavoriteWord) {
      throw new UnprocessableEntityException({
        errorDefinition: ErrorDefinitions.WORD_FAVORITE_EXISTS,
      });
    }

    await this.rabbitMqUserFavoriteWord.emitMessage({
      wordId: word.id,
      userId,
    });
  }
}
