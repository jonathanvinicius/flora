import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { IHttpClient } from '../interfaces/http-client.interface';

/**
 * Implementation of HTTP client using NestJS HttpService
 */
@Injectable()
export class HttpClientService implements IHttpClient {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Perform a GET request
   */
  get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Observable<AxiosResponse<T>> {
    return this.httpService.get<T>(encodeURI(url), config);
  }

  /**
   * Perform a POST request
   */
  post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Observable<AxiosResponse<T>> {
    return this.httpService.post<T>(encodeURI(url), data, config);
  }

  /**
   * Perform a PUT request
   */
  put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Observable<AxiosResponse<T>> {
    return this.httpService.put<T>(encodeURI(url), data, config);
  }

  /**
   * Perform a PATCH request
   */
  patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Observable<AxiosResponse<T>> {
    return this.httpService.patch<T>(encodeURI(url), data, config);
  }

  /**
   * Perform a DELETE request
   */
  delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Observable<AxiosResponse<T>> {
    return this.httpService.delete<T>(encodeURI(url), config);
  }

  /**
   * Perform a generic request
   */
  request<T>(config: AxiosRequestConfig): Observable<AxiosResponse<T>> {
    return this.httpService.request<T>(config);
  }
}
