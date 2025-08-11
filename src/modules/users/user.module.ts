import { Module } from '@nestjs/common';
import {
  GetUserFavoriteWordsUseCase,
  GetUserMeUseCase,
  GetUserWordHistoryUsecase,
} from './usecases';
import { UserFavoriteWordsDataModule } from '@app/infra/database/contexts/relational/user-favorite-words';
import { UserService } from './user.service';
import { IUserService } from './user.service.interface';
import { UserController } from './user.controller';
import {
  UserDataModule,
  UserSearchHistoryDataModule,
} from '@app/infra/database/contexts';

@Module({
  controllers: [UserController],
  imports: [
    UserFavoriteWordsDataModule,
    UserDataModule,
    UserSearchHistoryDataModule,
  ],
  providers: [
    { provide: IUserService, useClass: UserService },
    GetUserFavoriteWordsUseCase,
    GetUserMeUseCase,
    GetUserFavoriteWordsUseCase,
    GetUserWordHistoryUsecase,
  ],
})
export class UserModule {}
