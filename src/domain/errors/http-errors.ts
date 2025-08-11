import { createErrorDefinition } from '@app/shared/utils';
import { ErrorCode } from '../enums';
import { TranslationFilePrefix } from '@app/infra/modules/i18n';

export const HttpErrors = {
  [ErrorCode.GENERIC_ERROR]: createErrorDefinition(
    ErrorCode.GENERIC_ERROR,
    TranslationFilePrefix.ERROR,
  ),
  [ErrorCode.INTERNAL_SERVER_ERROR]: createErrorDefinition(
    ErrorCode.INTERNAL_SERVER_ERROR,
    TranslationFilePrefix.ERROR,
  ),
  [ErrorCode.BAD_REQUEST]: createErrorDefinition(
    ErrorCode.BAD_REQUEST,
    TranslationFilePrefix.ERROR,
  ),
  [ErrorCode.UNAUTHORIZED]: createErrorDefinition(
    ErrorCode.UNAUTHORIZED,
    TranslationFilePrefix.ERROR,
  ),
  [ErrorCode.FORBIDDEN]: createErrorDefinition(
    ErrorCode.FORBIDDEN,
    TranslationFilePrefix.ERROR,
  ),
  [ErrorCode.NOT_FOUND]: createErrorDefinition(
    ErrorCode.NOT_FOUND,
    TranslationFilePrefix.ERROR,
  ),
  [ErrorCode.CONFLICT]: createErrorDefinition(
    ErrorCode.CONFLICT,
    TranslationFilePrefix.ERROR,
  ),
  [ErrorCode.UNPROCESSABLE_ENTITY]: createErrorDefinition(
    ErrorCode.UNPROCESSABLE_ENTITY,
    TranslationFilePrefix.ERROR,
  ),
  [ErrorCode.TOO_MANY_REQUESTS]: createErrorDefinition(
    ErrorCode.TOO_MANY_REQUESTS,
    TranslationFilePrefix.ERROR,
  ),
  [ErrorCode.MISSING_OR_INVALID_PARAMS]: createErrorDefinition(
    ErrorCode.MISSING_OR_INVALID_PARAMS,
    TranslationFilePrefix.ERROR,
  ),
  [ErrorCode.INVALID_TOKEN]: createErrorDefinition(
    ErrorCode.INVALID_TOKEN,
    TranslationFilePrefix.ERROR,
  ),
  [ErrorCode.BAD_GATEWAY]: createErrorDefinition(
    ErrorCode.BAD_GATEWAY,
    TranslationFilePrefix.ERROR,
  ),

  [ErrorCode.FAILED_DEPENDENCY]: createErrorDefinition(
    ErrorCode.FAILED_DEPENDENCY,
    TranslationFilePrefix.ERROR,
  ),
  [ErrorCode.WORD_NOT_FOUND]: createErrorDefinition(
    ErrorCode.WORD_NOT_FOUND,
    TranslationFilePrefix.ERROR,
  ),
  [ErrorCode.WORD_FAVORITE_EXISTS]: createErrorDefinition(
    ErrorCode.WORD_FAVORITE_EXISTS,
    TranslationFilePrefix.ERROR,
  ),
} as const;
