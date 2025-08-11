interface IApiConfig {
  url: string;
  username?: string;
  password?: string;
  token?: string;
}
/**
 * API Config
 */
export class ApiConfig implements IApiConfig {
  url: string;
  username?: string;
  password?: string;
  token?: string;

  constructor(config: IApiConfig) {
    this.url = config.url;
    this.username = config.username;
    this.password = config.password;
    this.token = config.token;
  }
}
