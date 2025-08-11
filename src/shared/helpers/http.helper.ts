import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';

import { ErrorDefinitions } from '@app/domain/errors';
import { Languages } from '@app/infra/modules/i18n';
import { ErrorResponse } from '../responses';

export class HttpHelper {
  /**
   * Extracts the preferred language from the request headers.
   * Defaults to Portuguese (pt) if no language is specified.
   */
  static getLanguage(request: Request): Languages {
    return (request.headers['accept-language']?.split(',')[0] ||
      Languages.PT) as Languages;
  }

  /**
   * Creates a standardized internal server error response with a custom message.
   */

  static buildInternalErrorResponse(
    message: string,
    code?: HttpStatus,
  ): ErrorResponse {
    const status = code ?? HttpStatus.INTERNAL_SERVER_ERROR;
    return {
      code: ErrorDefinitions[HttpStatus[status]].code,
      statusCode: status,
      statusCodeAsString: HttpStatus[status],
      description: message,
    };
  }

  /**
   * Retrieves the client IP address from the request using multiple strategies.
   * Prioritizes 'x-forwarded-for' if present, and includes fallbacks to other socket properties.
   * Logs all detected sources for traceability.
   */
  static getClientIp(request: Request): string {
    const xForwardedFor = request.headers['x-forwarded-for'];
    const clientIpFromHeader =
      typeof xForwardedFor === 'string'
        ? xForwardedFor.split(',')[0].trim()
        : undefined;

    const clientIpFromSocket = request.socket?.remoteAddress;
    const clientIpFromConnection = request.connection?.remoteAddress;
    const clientIpFromInfo = (request as any).ip;

    return (
      clientIpFromHeader ||
      clientIpFromInfo ||
      clientIpFromSocket ||
      clientIpFromConnection ||
      ''
    );
  }
}
