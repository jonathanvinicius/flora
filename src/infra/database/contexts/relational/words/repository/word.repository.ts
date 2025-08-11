import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WordModel } from '../model/word.model';
import { BaseRepository } from '../../base';
import { IWordRepository } from '@app/domain';

@Injectable()
export class WordRepository
  extends BaseRepository<WordModel>
  implements IWordRepository
{
  constructor(
    @InjectModel(WordModel)
    private readonly userModel: typeof WordModel,
  ) {
    super(userModel);
  }
}
