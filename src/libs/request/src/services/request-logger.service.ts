import { Injectable, Logger } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { IRequestLogger } from '../interfaces/request-logger.interface';

/**
 * Service for logging HTTP requests and responses
 */
@Injectable()
export class RequestLoggerService implements IRequestLogger {
  private readonly logger: Logger;
  private showLogs: boolean;

  constructor() {
    const loggerName = process.env.REQUEST_LOGGER_NAME || 'HttpClient';
    this.logger = new Logger(loggerName);
    this.showLogs = process.env.SHOW_AXIOS_LOGS === 'true';
  }

  /**
   * Set whether to show logs
   */
  setShowLogs(show: boolean): void {
    this.showLogs = show;
  }

  /**
   * Log request details
   */
  logRequest(config: AxiosRequestConfig, sensitive = false): void {
    if (!this.showLogs) return;

    const { url, method, baseURL } = config;

    this.logger.log(`Request: ${method?.toUpperCase()} ${baseURL || ''}${url}`);

    // Only log potentially sensitive data if explicitly requested
    if (sensitive) {
      const { headers, params, data } = config;
      if (headers) this.logger.log(`Headers: ${JSON.stringify(headers)}`);
      if (params) this.logger.log(`Params: ${JSON.stringify(params)}`);
      if (data) this.logger.log(`Data: ${JSON.stringify(data)}`);
    }
  }

  /**
   * Log error details
   */
  logError(error: Error, context?: string): void {
    const prefix = context ? `[${context}] ` : '';
    this.logger.error(`${prefix}${error.message}`);
  }

  /**
   * Log informational message
   */
  log(message: any): void {
    if (!this.showLogs) return;

    this.logger.log(message instanceof Error ? message.message : message);
  }
}
