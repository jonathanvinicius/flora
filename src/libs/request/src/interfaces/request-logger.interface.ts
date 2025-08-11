import { AxiosRequestConfig } from 'axios';

/**
 * Interface for request logging functionality
 */
export interface IRequestLogger {
  /**
   * Log request details
   * @param config Request configuration
   * @param sensitive Whether to include potentially sensitive data
   */
  logRequest(config: AxiosRequestConfig, sensitive?: boolean): void;

  /**
   * Log error details
   * @param error Error object
   * @param context Optional context information
   */
  logError(error: Error, context?: string): void;

  /**
   * Log informational message
   * @param message Message to log
   */
  log(message: any): void;
}
