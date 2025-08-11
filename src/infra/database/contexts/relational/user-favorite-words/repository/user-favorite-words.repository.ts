import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../../base';
import { IUserFavoriteWordRepository } from '@app/domain';
import { UserFavoriteWordModel } from '../model/user-favorite-word.model';

@Injectable()
export class UserFavoriteWordsRepository
  extends BaseRepository<UserFavoriteWordModel>
  implements IUserFavoriteWordRepository
{
  constructor(
    @InjectModel(UserFavoriteWordModel)
    private readonly userFavoriteModel: typeof UserFavoriteWordModel,
  ) {
    super(userFavoriteModel);
  }
}
