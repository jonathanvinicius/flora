import { AxiosHeaders, AxiosRequestConfig } from 'axios';

/**
 * Builder for creating HTTP request configurations
 */
export class RequestBuilder {
  private config: AxiosRequestConfig = {};
  private urlParams: Record<string, string> = {};
  private queryParams: Record<string, string | number | boolean> = {};

  /**
   * Set the base URL
   */
  setBaseUrl(baseUrl: string): RequestBuilder {
    this.config.baseURL = baseUrl;
    return this;
  }

  /**
   * Set the endpoint path
   */
  setEndpoint(endpoint: string): RequestBuilder {
    this.config.url = endpoint;
    return this;
  }

  /**
   * Add URL parameters to replace in the path
   */
  addUrlParam(key: string, value: string): RequestBuilder {
    this.urlParams[key] = value;
    return this;
  }

  /**
   * Add query parameters
   */
  addQueryParam(key: string, value: string | number | boolean): RequestBuilder {
    this.queryParams[key] = value;
    return this;
  }

  /**
   * Add multiple query parameters
   */
  addQueryParams(
    params: Record<string, string | number | boolean>,
  ): RequestBuilder {
    Object.entries(params).forEach(([key, value]) => {
      this.addQueryParam(key, value);
    });
    return this;
  }

  /**
   * Set request headers
   */
  setHeaders(headers: Record<string, string> | AxiosHeaders): RequestBuilder {
    this.config.headers = headers;
    return this;
  }

  /**
   * Add a single header
   */
  addHeader(key: string, value: string): RequestBuilder {
    if (!this.config.headers) {
      this.config.headers = {};
    }
    this.config.headers[key] = value;
    return this;
  }

  /**
   * Set request body
   */
  setBody(data: any): RequestBuilder {
    this.config.data = data;
    return this;
  }

  /**
   * Set request timeout in milliseconds
   */
  setTimeout(timeout: number): RequestBuilder {
    this.config.timeout = timeout;
    return this;
  }

  /**
   * Build the final request configuration
   */
  build(): AxiosRequestConfig {
    // Process URL parameters
    if (this.config.url && Object.keys(this.urlParams).length > 0) {
      let url = this.config.url;
      Object.entries(this.urlParams).forEach(([key, value]) => {
        url = url.replace(`:${key}`, encodeURIComponent(value));
      });
      this.config.url = url;
    }

    // Add query parameters
    if (Object.keys(this.queryParams).length > 0) {
      this.config.params = this.queryParams;
    }

    return this.config;
  }
}
