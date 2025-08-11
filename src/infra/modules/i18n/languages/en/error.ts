import { ErrorCode } from '@app/domain/enums';

export const error = {
  [ErrorCode.GENERIC_ERROR]:
    'An unexpected error occurred. Please try again later or contact support.',
  [ErrorCode.INTERNAL_SERVER_ERROR]:
    'Internal server error. Please try again later.',
  [ErrorCode.BAD_REQUEST]:
    'The request could not be understood or was missing required parameters.',
  [ErrorCode.UNAUTHORIZED]:
    'You are not authorized to perform this action. Please log in.',
  [ErrorCode.FORBIDDEN]: 'You do not have permission to access this resource.',
  [ErrorCode.NOT_FOUND]: 'The requested resource was not found.',
  [ErrorCode.CONFLICT]:
    'A conflict occurred with the current state of the resource.',
  [ErrorCode.UNPROCESSABLE_ENTITY]:
    'The request was well-formed but could not be processed due to semantic errors.',
  [ErrorCode.TOO_MANY_REQUESTS]:
    'You have made too many requests in a short period. Please try again later.',
  [ErrorCode.MISSING_OR_INVALID_PARAMS]:
    'Some required parameters are missing or invalid. Please check your request and try again.',
  [ErrorCode.INVALID_TOKEN]: 'The provided token is invalid or expired.',
  [ErrorCode.BAD_GATEWAY]: 'Service unavailable.',
  [ErrorCode.USER_UNAUTHORIZED]: 'User not found.',
  [ErrorCode.USER_NOT_FOUND_OR_PASSWORD]: 'Incorrect username or password.',
  [ErrorCode.USER_EXISTS]: 'User is already registered.',
  [ErrorCode.FAILED_DEPENDENCY]:
    'Unable to get settings due to external service failure.',
  [ErrorCode.WORD_NOT_FOUND]: 'Word not found.',
  [ErrorCode.WORD_FAVORITE_EXISTS]: 'Already favorited word.',
};
