import { ObjectUtil } from '../utils';
import { AxiosHeaders, AxiosRequestConfig } from 'axios';
import { IMapper } from './base.mapper';

export type QueryParameterValue = {
  [key: string]: string | number | boolean | Date;
};

export type ParameterValue = {
  [key: string]: string | number | boolean | Date | Record<string, any>;
};

export interface IBaseParameter {
  /**
   * Push parameter
   */
  push(params: Record<string, string | number | boolean | Date>): void;
  /**
   * Push single parameter
   */
  pushParam(key: string, value: string | number | boolean | Date): void;
  /**
   * Parameters values
   */
  get values(): string | any;
}

export abstract class BaseParameter {
  protected _endpoint: string;
  protected _path?: string;
  public url: string;

  protected queryParams: string;
  protected _values: any;
  protected _headers: AxiosHeaders;
  config: AxiosRequestConfig;
  mapper: IMapper;

  constructor(
    endpoint: string,
    headers?: AxiosHeaders,
    config?: AxiosRequestConfig,
    mapper?: IMapper,
  ) {
    this._endpoint = endpoint;
    this._values = {};
    this.config = config ?? {};
    this._headers = headers;
    if (headers) {
      this.config.headers = {};
      const keys = Object.keys(headers);
      for (const key of keys) {
        this.config.headers[key] = headers[key];
      }
    }
    this.mapper = mapper;
  }

  /**
   * Set parameters
   */
  push(o: ParameterValue | Array<ParameterValue>) {
    if (!o) return;
    const keys = Object.keys(o);
    for (const k of keys) {
      this._values[k] = o[k];
    }
    ObjectUtil.ensure(this._values);
  }

  /**
   * Set an object parameter
   */
  pushObject(o: any) {
    const keys = Object.keys(o);
    for (const k of keys) {
      this._values[k] = o[k];
    }
    ObjectUtil.ensure(this._values);
  }

  /**
   * Set single parameter
   */
  pushParam(key: string, value: string | number | boolean | Date) {
    if (!key || key === '') {
      throw new Error('key is required to pushParam');
    }
    if (!value || value === '') {
      throw new Error('value is required to pushParam');
    }
    this._values[key] = value;
    return this._values[key];
  }

  /**
   * Push array parameter `in query`
   */
  pushParamArray(name: string, values: Array<any>) {
    if (values.length > 0) {
      let params = values[0];
      for (let i = 1; i < values.length; i++) {
        const id = values[i];
        params = `${params},${id}`;
      }
      this.pushParam(name, params);
    }
  }

  /**
   * Build url request
   */
  requestUrl(baseUrl: string) {
    if (this._path) {
      this.url = `${baseUrl}/${this._endpoint}`;
    } else {
      if (this.values instanceof Object) {
        this.url = `${baseUrl}/${this.endpoint}`;
      } else {
        this.url = `${baseUrl}/${this.endpoint}${this.values}`;
      }
    }
    return this.url;
  }

  /**
   * Route request
   */
  get endpoint(): string {
    return this._endpoint;
  }

  /**
   * Push parameter `in path`
   */
  set path(value: string) {
    this._path = value;
  }

  /**
   * Push parameter `in header`
   */
  set headers(value: AxiosHeaders) {
    this._headers = value;
    const keys = Object.keys(value);
    this.config.headers = {};
    for (const key of keys) {
      this.config.headers[key] = value[key];
    }
  }
  /**
   * Get headers
   */
  get headers(): AxiosHeaders {
    return this._headers;
  }

  /**
   * Get body
   */
  get data() {
    return this.config.data;
  }

  /**
   * Get query
   */
  get params() {
    return this.config.params;
  }

  /**
   * Get values
   */
  get values(): any {
    if (!this._values || Object.keys(this._values).length === 0) {
      return '';
    }
    return this._values;
  }
}
