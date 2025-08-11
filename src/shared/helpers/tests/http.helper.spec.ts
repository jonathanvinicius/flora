import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { Languages } from '../../../infra/modules/i18n/enum/language.enum';
import { ErrorDefinitions } from '../../../domain/errors';
import { ErrorResponse } from '../../responses/error.response';
import { HttpHelper } from '../http.helper';

describe('HttpHelper', () => {
  describe('getLanguage', () => {
    it('should return Portuguese as default when no accept-language header', () => {
      const mockRequest = {
        headers: {},
      } as Request;

      const result = HttpHelper.getLanguage(mockRequest);

      expect(result).toBe(Languages.PT);
    });

    it('should return Portuguese as default when accept-language header is empty', () => {
      const mockRequest = {
        headers: {
          'accept-language': '',
        },
      } as Request;

      const result = HttpHelper.getLanguage(mockRequest);

      expect(result).toBe(Languages.PT);
    });

    it('should extract first language from accept-language header', () => {
      const mockRequest = {
        headers: {
          'accept-language': 'en-US,pt-BR;q=0.9,en;q=0.8',
        },
      } as Request;

      const result = HttpHelper.getLanguage(mockRequest);

      expect(result).toBe('en-US');
    });

    it('should handle single language in accept-language header', () => {
      const mockRequest = {
        headers: {
          'accept-language': 'pt-BR',
        },
      } as Request;

      const result = HttpHelper.getLanguage(mockRequest);

      expect(result).toBe('pt-BR');
    });

    it('should handle accept-language header with quality values', () => {
      const mockRequest = {
        headers: {
          'accept-language': 'fr-FR;q=0.8,en-US;q=0.9',
        },
      } as Request;

      const result = HttpHelper.getLanguage(mockRequest);

      expect(result).toBe('fr-FR;q=0.8');
    });

    it('should handle accept-language header with spaces', () => {
      const mockRequest = {
        headers: {
          'accept-language': ' en-US , pt-BR;q=0.9',
        },
      } as Request;

      const result = HttpHelper.getLanguage(mockRequest);

      expect(result).toBe(' en-US ');
    });

    it('should return Portuguese when accept-language header is undefined', () => {
      const mockRequest = {
        headers: {
          'accept-language': undefined,
        },
      } as Request;

      const result = HttpHelper.getLanguage(mockRequest);

      expect(result).toBe(Languages.PT);
    });

    it('should handle malformed accept-language header', () => {
      const mockRequest = {
        headers: {
          'accept-language': 'invalid-format',
        },
      } as Request;

      const result = HttpHelper.getLanguage(mockRequest);

      expect(result).toBe('invalid-format');
    });
  });

  describe('buildInternalErrorResponse', () => {
    it('should create internal server error response with custom message', () => {
      const customMessage = 'Database connection failed';

      const result = HttpHelper.buildInternalErrorResponse(customMessage);

      const expected: ErrorResponse = {
        code: ErrorDefinitions.INTERNAL_SERVER_ERROR.code,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        statusCodeAsString: 'INTERNAL_SERVER_ERROR',
        description: customMessage,
      };

      expect(result).toEqual(expected);
    });

    it('should create internal server error response with empty message', () => {
      const customMessage = '';

      const result = HttpHelper.buildInternalErrorResponse(customMessage);

      expect(result.description).toBe('');
      expect(result.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.statusCodeAsString).toBe('INTERNAL_SERVER_ERROR');
      expect(result.code).toBe(ErrorDefinitions.INTERNAL_SERVER_ERROR.code);
    });

    it('should create internal server error response with long message', () => {
      const customMessage =
        'This is a very long error message that describes in detail what went wrong during the processing of the request and provides comprehensive information about the failure';

      const result = HttpHelper.buildInternalErrorResponse(customMessage);

      expect(result.description).toBe(customMessage);
      expect(result.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should create internal server error response with special characters', () => {
      const customMessage = 'Error with special chars: áéíóú ñ ç @#$%^&*()';

      const result = HttpHelper.buildInternalErrorResponse(customMessage);

      expect(result.description).toBe(customMessage);
      expect(result.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should always return status 500', () => {
      const result = HttpHelper.buildInternalErrorResponse('Any message');

      expect(result.statusCode).toBe(500);
      expect(result.statusCodeAsString).toBe('INTERNAL_SERVER_ERROR');
    });

    it('should always use INTERNAL_SERVER_ERROR code from ErrorDefinitions', () => {
      const result = HttpHelper.buildInternalErrorResponse('Test message');

      expect(result.code).toBe(ErrorDefinitions.INTERNAL_SERVER_ERROR.code);
    });

    it('should handle null message gracefully', () => {
      const result = HttpHelper.buildInternalErrorResponse(null as any);

      expect(result.description).toBe(null);
      expect(result.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should handle undefined message gracefully', () => {
      const result = HttpHelper.buildInternalErrorResponse(undefined as any);

      expect(result.description).toBe(undefined);
      expect(result.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('getClientIp', () => {
    it('should return IP from x-forwarded-for header', () => {
      const mockRequest = {
        headers: {
          'x-forwarded-for': '203.0.113.195',
        },
        socket: { remoteAddress: '10.0.0.1' },
        connection: { remoteAddress: '10.0.0.2' },
      } as unknown as Request;

      const result = HttpHelper.getClientIp(mockRequest);

      expect(result).toBe('203.0.113.195');
    });

    it('should return the first IP when x-forwarded-for contains multiple', () => {
      const mockRequest = {
        headers: {
          'x-forwarded-for': '203.0.113.195, 70.41.3.18, 150.172.238.178',
        },
        socket: { remoteAddress: '10.0.0.1' },
        connection: { remoteAddress: '10.0.0.2' },
      } as unknown as Request;

      const result = HttpHelper.getClientIp(mockRequest);

      expect(result).toBe('203.0.113.195');
    });

    it('should fallback to req.ip when x-forwarded-for is missing', () => {
      const mockRequest = {
        headers: {},
        ip: '192.168.1.100',
        socket: { remoteAddress: '10.0.0.1' },
        connection: { remoteAddress: '10.0.0.2' },
      } as unknown as Request;

      const result = HttpHelper.getClientIp(mockRequest);

      expect(result).toBe('192.168.1.100');
    });

    it('should fallback to socket.remoteAddress when others are missing', () => {
      const mockRequest = {
        headers: {},
        socket: { remoteAddress: '172.16.0.10' },
        connection: {},
      } as unknown as Request;

      const result = HttpHelper.getClientIp(mockRequest);

      expect(result).toBe('172.16.0.10');
    });

    it('should fallback to connection.remoteAddress when others are missing', () => {
      const mockRequest = {
        headers: {},
        socket: {},
        connection: { remoteAddress: '172.16.0.99' },
      } as unknown as Request;

      const result = HttpHelper.getClientIp(mockRequest);

      expect(result).toBe('172.16.0.99');
    });

    it('should return empty string if no IPs are found', () => {
      const mockRequest = {
        headers: {},
        socket: {},
        connection: {},
      } as unknown as Request;

      const result = HttpHelper.getClientIp(mockRequest);

      expect(result).toBe('');
    });

    it('should handle x-forwarded-for as non-string gracefully', () => {
      const mockRequest = {
        headers: {
          'x-forwarded-for': ['invalid'] as any,
        },
        ip: '192.168.1.123',
      } as unknown as Request;

      const result = HttpHelper.getClientIp(mockRequest);

      expect(result).toBe('192.168.1.123');
    });
  });
});
