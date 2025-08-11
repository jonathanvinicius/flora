import { INestMicroservice } from '@nestjs/common';
import { IAppConfig } from '../interfaces';
/**
 * Configuration to control app
 * > Singletone
 */
export class Configuration {
  private static _instance: Configuration;
  private static _config: IAppConfig;
  private _nestApp: INestMicroservice;

  /** Alias name for Configuration */
  static get I(): Configuration {
    if (!Configuration._instance) {
      Configuration._instance = new Configuration();
    }
    return Configuration._instance;
  }

  /**
   * Load config into `IAppConfig`
   */
  static load(envConfig: any): IAppConfig {
    //set app config and return
    Configuration._config = envConfig;
    return envConfig;
  }

  /** App config */
  get config(): IAppConfig {
    return Configuration._config;
  }

  /**
   * Nest Application
   */
  public setApp(app: INestMicroservice) {
    this._nestApp = app;
  }

  /**
   * Nest Application
   */
  get app() {
    return this._nestApp;
  }

  static isDev() {
    return process.env.NODE_ENV === 'development';
  }
  static isPrd() {
    return process.env.NODE_ENV === 'production';
  }
  static isLog() {
    return process.env.ENABLE_LOGGER === 'true';
  }
  static get envName() {
    return process.env.NODE_ENV;
  }
}
