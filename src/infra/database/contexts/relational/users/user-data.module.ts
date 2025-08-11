import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { IUSER_REPOSITORY } from '@app/domain';
import { UserModel } from './model/user.model';
import { UserRepository } from './repository/user.repository';

@Module({
  imports: [SequelizeModule.forFeature([UserModel])],
  providers: [
    {
      provide: IUSER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: [IUSER_REPOSITORY],
})
export class UserDataModule {}
