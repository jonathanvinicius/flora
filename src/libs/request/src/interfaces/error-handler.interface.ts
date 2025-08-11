import { AxiosError } from 'axios';

/**
 * Interface for HTTP error handling
 */
export interface IErrorHandler {
  /**
   * Handle HTTP request errors
   * @param error The error that occurred
   * @param context Optional context information
   */
  handleError(error: AxiosError, context?: string): Error;
}
