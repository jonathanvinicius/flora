import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from '../model/user.model';
import { BaseRepository } from '../../base';
import { IUserRepository } from '@app/domain';

@Injectable()
export class UserRepository
  extends BaseRepository<UserModel>
  implements IUserRepository
{
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
  ) {
    super(userModel);
  }
}
