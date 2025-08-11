import { Module } from '@nestjs/common';
import {
  AcceptLanguageResolver,
  I18nModule as NestJsI18nModule,
} from 'nestjs-i18n';
import * as path from 'path';
import { Languages } from './enum';
import { I18N_PROVIDERS } from './providers';
import { I18nTsLoaderService } from './services';

@Module({
  imports: [
    NestJsI18nModule.forRoot({
      fallbackLanguage: Languages.PT,
      fallbacks: {
        'en-*': 'en',
        'pt-*': 'pt',
      },
      loaderOptions: {
        path: path.join(__dirname, './languages'),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
      loader: I18nTsLoaderService,
    }),
  ],
  providers: [...I18N_PROVIDERS.providers],
  exports: [NestJsI18nModule, ...I18N_PROVIDERS.exports],
})
export class I18nModule {}
