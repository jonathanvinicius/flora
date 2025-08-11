import { ErrorCode } from '@app/domain/enums';
import { TranslationFilePrefix } from '@app/infra/modules/i18n';

export function createErrorDefinition<T extends ErrorCode>(
  code: T,
  messageCodePrefix: TranslationFilePrefix = TranslationFilePrefix.ERROR,
) {
  return {
    code,
    messageCode: `${messageCodePrefix}.${code}`,
  } as const;
}
