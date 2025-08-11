import { AxiosHeaders, AxiosRequestConfig } from 'axios';
import { BaseParameter } from '../base/base.parameter';

export class BodyParameter extends BaseParameter {
  constructor(
    endpoint: string,
    headers?: AxiosHeaders,
    config?: AxiosRequestConfig,
  ) {
    super(endpoint, headers, config);
  }
  override get data() {
    return this.values;
  }
}
