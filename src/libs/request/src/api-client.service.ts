import { Inject, Injectable } from '@nestjs/common';
import {
  AxiosHeaders,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
} from 'axios';
import { Observable, catchError, firstValueFrom } from 'rxjs';
import { ApiConfig } from './config/api-config';
import { IErrorHandler } from './interfaces/error-handler.interface';
import { IHttpClient } from './interfaces/http-client.interface';
import {
  ERROR_HANDLER,
  HTTP_CLIENT,
  REQUEST_LOGGER,
} from './interfaces/injection-tokens';
import { IRequestLogger } from './interfaces/request-logger.interface';
import { ErrorHandlerService } from './services/error-handler.service';
import { HttpClientService } from './services/http-client.service';
import { RequestLoggerService } from './services/request-logger.service';
import { RequestBuilder } from './utils/request-builder';
import { HttpService } from '@nestjs/axios';

/**
 * API client service that combines HTTP client, logging, and error handling
 */
@Injectable()
export class ApiClientService {
  private baseUrl: string;
  private showLogs: boolean;

  constructor(
    @Inject(HTTP_CLIENT) private readonly httpClient: IHttpClient,
    @Inject(REQUEST_LOGGER) private readonly logger: IRequestLogger,
    @Inject(ERROR_HANDLER) private readonly errorHandler: IErrorHandler,
    config: ApiConfig,
  ) {
    this.baseUrl = config.url;
    this.showLogs = process.env.SHOW_AXIOS_LOGS === 'true';
  }

  /**
   * Static factory method to create an instance with default dependencies
   */
  static create(
    config: ApiConfig,
    httpClient?: HttpClientService,
  ): ApiClientService {
    const logger = new RequestLoggerService();
    const errorHandler = new ErrorHandlerService(logger);
    const http = httpClient || new HttpClientService(new HttpService());
    return new ApiClientService(http, logger, errorHandler, config);
  }

  /**
   * Enable or disable logging
   */
  setShowLogs(show: boolean): void {
    this.showLogs = show;
    if (this.logger instanceof RequestLoggerService) {
      this.logger.setShowLogs(show);
    }
  }

  /**
   * Create a request builder with the base URL pre-configured
   */
  createRequest(): RequestBuilder {
    return new RequestBuilder().setBaseUrl(this.baseUrl);
  }

  /**
   * Perform a GET request
   */
  async get<T>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const url = this.buildUrl(endpoint, config);
    this.logRequest({ url, method: 'GET', ...config });

    try {
      return await firstValueFrom(
        this.httpClient.get<T>(url, config).pipe(
          catchError((error) => {
            throw this.errorHandler.handleError(error, 'GET');
          }),
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Perform a POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const url = this.buildUrl(endpoint, config);
    this.logRequest({ url, method: 'POST', data, ...config });

    try {
      return await firstValueFrom(
        this.httpClient.post<T>(url, data, config).pipe(
          catchError((error) => {
            throw this.errorHandler.handleError(error, 'POST');
          }),
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Perform a PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const url = this.buildUrl(endpoint, config);
    this.logRequest({ url, method: 'PUT', data, ...config });

    try {
      return await firstValueFrom(
        this.httpClient.put<T>(url, data, config).pipe(
          catchError((error) => {
            throw this.errorHandler.handleError(error, 'PUT');
          }),
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Perform a PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const url = this.buildUrl(endpoint, config);
    this.logRequest({ url, method: 'PATCH', data, ...config });

    try {
      return await firstValueFrom(
        this.httpClient.patch<T>(url, data, config).pipe(
          catchError((error) => {
            throw this.errorHandler.handleError(error, 'PATCH');
          }),
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Perform a DELETE request
   */
  async delete<T>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const url = this.buildUrl(endpoint, config);
    this.logRequest({ url, method: 'DELETE', ...config });

    try {
      return await firstValueFrom(
        this.httpClient.delete<T>(url, config).pipe(
          catchError((error) => {
            throw this.errorHandler.handleError(error, 'DELETE');
          }),
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Perform a request with a custom configuration
   */
  async request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    if (config.url && !config.url.startsWith('http')) {
      config.url = this.buildUrl(config.url);
    }

    this.logRequest(config);

    try {
      return await firstValueFrom(
        this.httpClient.request<T>(config).pipe(
          catchError((error) => {
            throw this.errorHandler.handleError(error, 'request');
          }),
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get an observable for a request (advanced usage)
   */
  requestObservable<T>(
    config: AxiosRequestConfig,
  ): Observable<AxiosResponse<T>> {
    if (config.url && !config.url.startsWith('http')) {
      config.url = this.buildUrl(config.url);
    }

    this.logRequest(config);

    return this.httpClient.request<T>(config).pipe(
      catchError((error) => {
        throw this.errorHandler.handleError(error, 'requestObservable');
      }),
    );
  }

  /**
   * Build a full URL from an endpoint
   */
  private buildUrl(endpoint: string, config?: AxiosRequestConfig): string {
    return `${this.baseUrl || config.baseURL}/${endpoint}`;
  }

  /**
   * Log request details if logging is enabled
   */
  private logRequest(config: AxiosRequestConfig): void {
    if (this.showLogs) {
      this.logger.logRequest(config);
    }
  }

  getHeaders(token?: string): AxiosRequestHeaders {
    const headers = new AxiosHeaders();
    headers.set('accept', 'application/json');
    headers.set('Content-Type', 'application/json');
    if (token) {
      headers.set('Authorization', token);
    }

    return headers;
  }
}
