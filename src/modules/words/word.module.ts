import { DictionaryApiModule } from '@app/libs/dictionary-api/src/dictionary-api.module';
import { Module } from '@nestjs/common';
import {
  GetWordDefinitionsUseCase,
  SaveUserHistoryUseCase,
  GetWordsUseCase,
  PostUserFavoriteWordUseCase,
  SaveUserFavoriteWordUseCase,
  DeleteUserFavoriteWordUseCase,
  UserUnFavoriteWordUseCase,
  GetEnglishDictionaryUseCase,
} from './usecases';
import { IWordService } from './word.service.interface';
import { WordService } from './word.service';
import { WordsController } from './word.controller';
import { RabbitMqModule } from '@app/infra/modules/rabbitmq/src';
import { UserSearchHistoryDataModule } from '@app/infra/database/contexts';
import { WordDataModule } from '@app/infra/database/contexts/relational/words';
import { UserFavoriteWordsDataModule } from '@app/infra/database/contexts/relational/user-favorite-words';

@Module({
  controllers: [WordsController],
  imports: [
    DictionaryApiModule,
    RabbitMqModule,
    UserSearchHistoryDataModule,
    WordDataModule,
    UserFavoriteWordsDataModule,
  ],
  providers: [
    { provide: IWordService, useClass: WordService },
    GetWordDefinitionsUseCase,
    SaveUserHistoryUseCase,
    GetWordsUseCase,
    PostUserFavoriteWordUseCase,
    SaveUserFavoriteWordUseCase,
    DeleteUserFavoriteWordUseCase,
    UserUnFavoriteWordUseCase,
    GetEnglishDictionaryUseCase,
  ],
})
export class WordModule {}
