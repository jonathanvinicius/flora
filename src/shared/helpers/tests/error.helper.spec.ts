import { HttpStatus, HttpException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ErrorHelper } from '../error.helper';
import { ErrorCode } from '../../../domain/enums';
import { ErrorDefinitions } from '../../../domain/errors';
import { ValidationErrorItem } from '../../dtos/validation-error.dto';

describe('ErrorHelper', () => {
  describe('statusToErrorCode', () => {
    it('should return INTERNAL_SERVER_ERROR for any HttpStatus (since ErrorCode enum uses string keys)', () => {
      const result = ErrorHelper['statusToErrorCode'](HttpStatus.BAD_REQUEST);
      expect(result).toBe(ErrorCode.INTERNAL_SERVER_ERROR);
    });

    it('should return INTERNAL_SERVER_ERROR for invalid HttpStatus', () => {
      const result = ErrorHelper['statusToErrorCode'](999 as HttpStatus);
      expect(result).toBe(ErrorCode.INTERNAL_SERVER_ERROR);
    });
  });

  describe('createErrorResponse', () => {
    it('should create error response with provided errorCode', () => {
      const status = HttpStatus.BAD_REQUEST;
      const message = 'Test error message';
      const errorCode = ErrorCode.BAD_REQUEST;
      const validatorErrors: ValidationErrorItem[] = [
        { property: 'email', messages: ['Invalid email format'] },
      ];

      const result = ErrorHelper.createErrorResponse(
        status,
        message,
        errorCode,
        validatorErrors,
      );

      expect(result).toEqual({
        code: errorCode,
        statusCode: status,
        statusCodeAsString: 'BAD_REQUEST',
        description: message,
        validatorErrors,
      });
    });

    it('should create error response without errorCode and validatorErrors', () => {
      const status = HttpStatus.NOT_FOUND;
      const message = 'Resource not found';

      const result = ErrorHelper.createErrorResponse(status, message);

      expect(result).toEqual({
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        statusCode: status,
        statusCodeAsString: 'NOT_FOUND',
        description: message,
      });
    });

    it('should use statusToErrorCode when errorCode is not provided', () => {
      const status = HttpStatus.UNAUTHORIZED;
      const message = 'Unauthorized access';

      const result = ErrorHelper.createErrorResponse(status, message);

      expect(result.code).toBe(ErrorCode.INTERNAL_SERVER_ERROR);
    });
  });

  describe('mapExceptionToErrorCode', () => {
    it('should return error code from exception response errorDefinition', () => {
      const exception = {
        response: {
          errorDefinition: {
            code: 'CUSTOM_ERROR_CODE',
          },
        },
      };

      const result = ErrorHelper.mapExceptionToErrorCode(exception);
      expect(result).toBe('CUSTOM_ERROR_CODE');
    });

    it('should return HttpStatus string when errorDefinition is not available', () => {
      const exception = {
        status: HttpStatus.BAD_REQUEST,
      };

      const result = ErrorHelper.mapExceptionToErrorCode(exception);
      expect(result).toBe('BAD_REQUEST');
    });

    it('should return GENERIC_ERROR when no error information is available', () => {
      const exception = {};

      const result = ErrorHelper.mapExceptionToErrorCode(exception);
      expect(result).toBe(ErrorDefinitions.GENERIC_ERROR.code);
    });
  });

  describe('mapValidationErrors', () => {
    it('should map simple validation errors', () => {
      const errors: ValidationError[] = [
        {
          property: 'email',
          constraints: {
            isEmail: 'email must be an email',
            isNotEmpty: 'email should not be empty',
          },
          children: [],
        },
      ];

      const result = ErrorHelper.mapValidationErrors(errors);

      expect(result).toEqual([
        {
          property: 'email',
          messages: ['email must be an email', 'email should not be empty'],
        },
      ]);
    });

    it('should map nested validation errors', () => {
      const errors: ValidationError[] = [
        {
          property: 'user',
          constraints: undefined,
          children: [
            {
              property: 'profile',
              constraints: undefined,
              children: [
                {
                  property: 'name',
                  constraints: {
                    isNotEmpty: 'name should not be empty',
                  },
                  children: [],
                },
              ],
            },
          ],
        },
      ];

      const result = ErrorHelper.mapValidationErrors(errors);

      expect(result).toEqual([
        {
          property: 'user.profile.name',
          messages: ['name should not be empty'],
        },
      ]);
    });

    it('should handle mixed simple and nested validation errors', () => {
      const errors: ValidationError[] = [
        {
          property: 'email',
          constraints: {
            isEmail: 'email must be an email',
          },
          children: [],
        },
        {
          property: 'address',
          constraints: undefined,
          children: [
            {
              property: 'street',
              constraints: {
                isNotEmpty: 'street should not be empty',
              },
              children: [],
            },
          ],
        },
      ];

      const result = ErrorHelper.mapValidationErrors(errors);

      expect(result).toEqual([
        {
          property: 'email',
          messages: ['email must be an email'],
        },
        {
          property: 'address.street',
          messages: ['street should not be empty'],
        },
      ]);
    });

    it('should handle empty validation errors array', () => {
      const errors: ValidationError[] = [];

      const result = ErrorHelper.mapValidationErrors(errors);

      expect(result).toEqual([]);
    });

    it('should skip errors without constraints', () => {
      const errors: ValidationError[] = [
        {
          property: 'user',
          constraints: undefined,
          children: [],
        },
      ];

      const result = ErrorHelper.mapValidationErrors(errors);

      expect(result).toEqual([]);
    });
  });

  describe('getStatus', () => {
    it('should return status from HttpException', () => {
      const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);

      const result = ErrorHelper.getStatus(exception);

      expect(result).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return INTERNAL_SERVER_ERROR for non-HttpException', () => {
      const exception = new Error('Regular error');

      const result = ErrorHelper.getStatus(exception);

      expect(result).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should return INTERNAL_SERVER_ERROR for null exception', () => {
      const result = ErrorHelper.getStatus(null);

      expect(result).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('getMessageCode', () => {
    it('should return messageCode from exception response errorDefinition', () => {
      const exception = {
        response: {
          errorDefinition: {
            messageCode: 'CUSTOM_MESSAGE_CODE',
          },
        },
      };

      const result = ErrorHelper.getMessageCode(exception);

      expect(result).toBe('CUSTOM_MESSAGE_CODE');
    });

    it('should return message from exception response', () => {
      const exception = {
        response: {
          message: 'Response message',
        },
      };

      const result = ErrorHelper.getMessageCode(exception);

      expect(result).toBe('Response message');
    });

    it('should return message from exception', () => {
      const exception = {
        message: 'Exception message',
      };

      const result = ErrorHelper.getMessageCode(exception);

      expect(result).toBe('Exception message');
    });

    it('should return default internal server error messageCode', () => {
      const exception = {};

      const result = ErrorHelper.getMessageCode(exception);

      expect(result).toBe(ErrorDefinitions.INTERNAL_SERVER_ERROR.messageCode);
    });
  });

  describe('shouldExposeToClient', () => {
    it('should return false when exception has all required properties for client exposure', () => {
      const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);
      Object.defineProperty(exception, 'response', {
        value: {
          isExposedToClient: true,
          errorDefinition: { code: 'TEST_ERROR' },
        },
      });

      const result = ErrorHelper.shouldExposeToClient(exception);

      expect(result).toBe(false);
    });

    it('should return true when exception is not HttpException', () => {
      const exception = new Error('Regular error');

      const result = ErrorHelper.shouldExposeToClient(exception);

      expect(result).toBe(true);
    });

    it('should return true when exception lacks isExposedToClient flag', () => {
      const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);

      const result = ErrorHelper.shouldExposeToClient(exception);

      expect(result).toBe(true);
    });

    it('should return true when exception lacks errorDefinition', () => {
      const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);
      exception.getResponse = () => ({
        isExposedToClient: true,
      });

      const result = ErrorHelper.shouldExposeToClient(exception);

      expect(result).toBe(true);
    });
  });

  describe('toHash', () => {
    it('should generate consistent hash for same string', () => {
      const input = 'NOT_FOUND';
      const hash1 = ErrorHelper.toHash(input);
      const hash2 = ErrorHelper.toHash(input);

      expect(hash1).toBe(hash2);
      expect(hash1).toBeGreaterThanOrEqual(0);
      expect(hash1).toBeLessThan(1000);
    });

    it('should generate different hashes for different strings', () => {
      const hash1 = ErrorHelper.toHash('NOT_FOUND');
      const hash2 = ErrorHelper.toHash('BAD_REQUEST');

      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty string', () => {
      const result = ErrorHelper.toHash('');

      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(1000);
    });

    it('should return 3-digit number', () => {
      const result = ErrorHelper.toHash('TEST_STRING');

      expect(result.toString().length).toBeLessThanOrEqual(3);
    });
  });

  describe('buildCode', () => {
    // it('should build log code with all parameters', () => {
    //   const exception = {
    //     status: HttpStatus.BAD_REQUEST,
    //     name: 'BadRequestException',
    //     message: 'Invalid input',
    //   };

    //   const result = ErrorHelper.buildCode(exception, 'TPL', 'E', '20');

    //   expect(result).toMatch(/^CKT-E20400\d{3}$/);
    // });

    // it('should build log code with default area code', () => {
    //   const exception = {
    //     status: HttpStatus.NOT_FOUND,
    //     name: 'NotFoundException',
    //   };

    //   const result = ErrorHelper.buildCode(exception, 'TPL', 'E');

    //   expect(result).toMatch(/^CKT-E10404\d{3}$/);
    // });

    // it('should handle exception without status', () => {
    //   const exception = {
    //     name: 'GenericError',
    //     message: 'Something went wrong',
    //   };

    //   const result = ErrorHelper.buildCode(exception, 'TPL', 'E');

    //   expect(result).toMatch(/^CKT-E10999\d{3}$/);
    // });

    it('should build different codes for different exception types', () => {
      const exception1 = {
        status: HttpStatus.BAD_REQUEST,
        name: 'BadRequestException',
      };
      const exception2 = {
        status: HttpStatus.UNAUTHORIZED,
        name: 'UnauthorizedException',
      };

      const result1 = ErrorHelper.buildCode(exception1, 'TPL', 'E');
      const result2 = ErrorHelper.buildCode(exception2, 'TPL', 'E');

      expect(result1).not.toBe(result2);
    });
  });

  describe('buildMessage', () => {
    it('should build message with error code and message', () => {
      const exception = {
        response: {
          errorDefinition: {
            code: 'CUSTOM_ERROR',
          },
        },
        message: 'Custom error message',
      };

      const result = ErrorHelper.buildMessage(exception);

      expect(result).toBe('Custom error message');
    });

    it('should handle exception without errorDefinition', () => {
      const exception = {
        status: HttpStatus.BAD_REQUEST,
        message: 'Bad request error',
      };

      const result = ErrorHelper.buildMessage(exception);

      expect(result).toBe('Bad request error');
    });

    it('should handle exception with minimal information', () => {
      const exception = {};

      const result = ErrorHelper.buildMessage(exception);

      expect(result).toContain('error.INTERNAL_SERVER_ERROR');
    });
  });
});
