import { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { BaseParameter } from '../base/base.parameter';

export class HeaderParameter extends BaseParameter {
  constructor(
    endpoint: string,
    headers?: AxiosRequestHeaders,
    config?: AxiosRequestConfig,
  ) {
    super(endpoint, headers, config);
  }
}
