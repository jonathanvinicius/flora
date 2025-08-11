import { I18nService } from '../services';
import { I18N_TOKENS } from '../tokens';
const { I18N_SERVICE } = I18N_TOKENS;

export const I18N_PROVIDERS = {
  providers: [
    {
      provide: I18N_SERVICE,
      useClass: I18nService,
    },
  ],
  exports: [I18N_SERVICE],
};
