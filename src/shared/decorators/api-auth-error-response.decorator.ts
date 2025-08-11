import { ErrorCode } from '../../domain/enums';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const ApiAuthErrorResponse = () => {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Validation errors in request body or headers',
      content: {
        'application/json': {
          examples: {
            missingCredentials: {
              summary: 'Missing credentials',
              value: {
                details: ['email must be a string'],
                message: 'Bad Request Exception',
                code: ErrorCode.MISSING_OR_INVALID_PARAMS,
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Invalid credentials',
      content: {
        'application/json': {
          examples: {
            invalidCredentials: {
              summary: 'Invalid username or password',
              value: {
                message: 'Incorrect username or password.',
                code: ErrorCode.USER_UNAUTHORIZED,
                statusText: 'UNAUTHORIZED',
                log: 'Request failed at 2025-08-10T21:36:39.605Z',
                path: '/auth/signin',
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal server error',
      content: {
        'application/json': {
          examples: {
            serverError: {
              summary: 'Internal server error',
              value: {
                code: ErrorCode.INTERNAL_SERVER_ERROR,
                statusCode: 500,
                description: 'An unexpected error occurred',
              },
            },
          },
        },
      },
    }),
  );
};
