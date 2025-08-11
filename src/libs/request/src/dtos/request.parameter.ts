import { AxiosHeaders, AxiosRequestConfig } from 'axios';
import { BaseParameter, ParameterValue } from '../base/base.parameter';
import { BodyParameter } from './body.parameter';
import { QueryParameter } from './query.parameter';

/**
 * Request parameters
 *
 * Request query, body or header
 */
export class RequestParameter extends BaseParameter {
  constructor(
    endpoint: string,
    query?: QueryParameter,
    body?: BodyParameter,
    headers?: AxiosHeaders,
    config?: AxiosRequestConfig,
  ) {
    super(endpoint, headers, config);
    this._query = query;
    this._body = body;
  }

  protected _endpoint: string;
  private _query?: QueryParameter;
  private _body?: BodyParameter;
  config: AxiosRequestConfig;

  /**
   * Push parameters `in query`
   */
  pushQuery(o: ParameterValue) {
    this._query.push(o);
  }

  /**
   * Push parameters `in body`
   */
  pushBody(o: ParameterValue) {
    this._body.push(o);
  }

  /**
   * Query parameters
   */
  override get params(): string {
    return this._query.values;
  }

  /**
   * Get body
   */
  override get data(): Record<string, any> {
    return this._body.values;
  }
}
