import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../../base';
import { IUserSearchHistoryRepository } from '@app/domain';
import { UserSearchHistoryModel } from '../model/user-search-history.model';

@Injectable()
export class UserSearchHistoryRepository
  extends BaseRepository<UserSearchHistoryModel>
  implements IUserSearchHistoryRepository
{
  constructor(
    @InjectModel(UserSearchHistoryModel)
    private readonly userSearchModel: typeof UserSearchHistoryModel,
  ) {
    super(userSearchModel);
  }

}
