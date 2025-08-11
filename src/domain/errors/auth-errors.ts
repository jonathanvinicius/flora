import { createErrorDefinition } from '@app/shared/utils/create-error-definition';
import { ErrorCode } from '../enums';

export const AuthErrors = {
  [ErrorCode.USER_UNAUTHORIZED]: createErrorDefinition(
    ErrorCode.USER_UNAUTHORIZED,
  ),
  [ErrorCode.USER_BLOCK]: createErrorDefinition(ErrorCode.USER_BLOCK),
  [ErrorCode.USER_NOT_FOUND_OR_PASSWORD]: createErrorDefinition(
    ErrorCode.USER_NOT_FOUND_OR_PASSWORD,
  ),
  [ErrorCode.USER_EXISTS]: createErrorDefinition(ErrorCode.USER_EXISTS),
} as const;
