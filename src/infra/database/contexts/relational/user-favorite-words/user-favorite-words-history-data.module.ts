import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { IUSER_FAVORITE_WORDS_REPOSITORY } from '@app/domain';
import { UserFavoriteWordModel } from './model/user-favorite-word.model';
import { UserFavoriteWordsRepository } from './repository/user-favorite-words.repository';

@Module({
  imports: [SequelizeModule.forFeature([UserFavoriteWordModel])],
  providers: [
    {
      provide: IUSER_FAVORITE_WORDS_REPOSITORY,
      useClass: UserFavoriteWordsRepository,
    },
  ],
  exports: [IUSER_FAVORITE_WORDS_REPOSITORY],
})
export class UserFavoriteWordsDataModule {}
