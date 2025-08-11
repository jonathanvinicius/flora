import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { IUSER_SEARCH_HISTORY_REPOSITORY } from '@app/domain';
import { UserSearchHistoryModel } from './model/user-search-history.model';
import { UserSearchHistoryRepository } from './repository/user-search-history.repository';

@Module({
  imports: [SequelizeModule.forFeature([UserSearchHistoryModel])],
  providers: [
    {
      provide: IUSER_SEARCH_HISTORY_REPOSITORY,
      useClass: UserSearchHistoryRepository,
    },
  ],
  exports: [IUSER_SEARCH_HISTORY_REPOSITORY],
})
export class UserSearchHistoryDataModule {}
