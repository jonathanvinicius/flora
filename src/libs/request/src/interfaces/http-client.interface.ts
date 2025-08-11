import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

/**
 * Interface for HTTP client operations
 */
export interface IHttpClient {
  /**
   * Perform a GET request
   * @param url The URL to request
   * @param config Optional request configuration
   */
  get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Observable<AxiosResponse<T>>;

  /**
   * Perform a POST request
   * @param url The URL to request
   * @param data The data to send
   * @param config Optional request configuration
   */
  post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Observable<AxiosResponse<T>>;

  /**
   * Perform a PUT request
   * @param url The URL to request
   * @param data The data to send
   * @param config Optional request configuration
   */
  put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Observable<AxiosResponse<T>>;

  /**
   * Perform a PATCH request
   * @param url The URL to request
   * @param data The data to send
   * @param config Optional request configuration
   */
  patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Observable<AxiosResponse<T>>;

  /**
   * Perform a DELETE request
   * @param url The URL to request
   * @param config Optional request configuration
   */
  delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Observable<AxiosResponse<T>>;

  /**
   * Perform a generic request
   * @param config Request configuration
   */
  request<T>(config: AxiosRequestConfig): Observable<AxiosResponse<T>>;
}
