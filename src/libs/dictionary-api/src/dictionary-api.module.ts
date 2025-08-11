import { Module } from '@nestjs/common';
import { GetWordDefinitionsUseCase } from './usecases';
import { CustomAxiosModule } from '@app/libs/request/src';
import { DictionaryApiService } from './dictionary-api.service';
import { IDictionaryApiService } from './dictionary-api.service.interface';

@Module({
  imports: [
    CustomAxiosModule.register({
      url: process.env.URL_DICTIONARY_API,
    }),
  ],
  providers: [
    {
      provide: IDictionaryApiService,
      useClass: DictionaryApiService,
    },
    GetWordDefinitionsUseCase,
  ],
  exports: [IDictionaryApiService],
})
export class DictionaryApiModule {}
