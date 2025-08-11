import { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { IMapper } from '../base';
import { BaseParameter, ParameterValue } from '../base/base.parameter';

export class QueryParameter extends BaseParameter {
  constructor(
    endpoint: string,
    headers?: AxiosRequestHeaders,
    config?: AxiosRequestConfig,
    mapper?: IMapper,
  ) {
    super(endpoint, headers, config, mapper);
    this.queryParams = '';
    this._values = [];
  }

  override get params() {
    return this.queryParams;
  }
  /**
   * Push parameters `in query`
   */
  override push(o: ParameterValue) {
    if (!o) return;
    const keys = Object.keys(o);
    for (const key of keys) {
      const value: any = o[key];
      this.pushParam(key, value);
    }
  }
  /**
   * Push single parameter
   */
  override pushParam(key: string, value: string | number | boolean | Date) {
    if (!key || key === '') {
      throw new Error('key is required to pushParam');
    }
    if (!value || value === '') {
      throw new Error('value is required to pushParam');
    }
    let newUrl = '';
    if (this._values.length == 0) {
      newUrl += `?${key}=${value}`;
    } else {
      newUrl += `&${key}=${value}`;
    }
    this._values.push({
      name: key,
      value: value,
    });
    this.queryParams += newUrl;
  }

  override get values(): string {
    return this.queryParams;
  }
}
