import { Inject, Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { IErrorHandler } from '../interfaces/error-handler.interface';
import { IRequestLogger } from '../interfaces/request-logger.interface';
import { REQUEST_LOGGER } from '../interfaces/injection-tokens';

/**
 * Service for handling HTTP request errors
 */
@Injectable()
export class ErrorHandlerService implements IErrorHandler {
  constructor(
    @Inject(REQUEST_LOGGER) private readonly logger: IRequestLogger,
  ) {}

  /**
   * Handle HTTP request errors
   */
  handleError(error: AxiosError, context?: string): Error {
    // Always log errors regardless of log settings
    if (error.isAxiosError && error.response) {
      const data = JSON.stringify(error.response.data);
      this.logger.logError(
        new Error(
          `${error.config?.url} | ${error.message} | response: ${data}`,
        ),
        context,
      );
    } else {
      this.logger.logError(error, context);
    }

    // Return the original error to allow for custom handling by consumers
    return error;
  }
}
