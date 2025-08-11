import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ApiClientService } from './api-client.service';
import { ApiConfig } from './config/api-config';
import {
  ERROR_HANDLER,
  HTTP_CLIENT,
  REQUEST_LOGGER,
} from './interfaces/injection-tokens';
import { ErrorHandlerService } from './services/error-handler.service';
import { HttpClientService } from './services/http-client.service';
import { RequestLoggerService } from './services/request-logger.service';

/**
 * Module for custom Axios integration
 */
@Module({})
export class CustomAxiosModule {
  /**
   * Register the module with default configuration
   */
  static register(config: ApiConfig): DynamicModule {
    return {
      module: CustomAxiosModule,
      imports: [HttpModule],
      providers: [
        {
          provide: ApiConfig,
          useValue: config,
        },
        {
          provide: REQUEST_LOGGER,
          useClass: RequestLoggerService,
        },
        {
          provide: ERROR_HANDLER,
          useClass: ErrorHandlerService,
        },
        {
          provide: HTTP_CLIENT,
          useClass: HttpClientService,
        },
        ApiClientService,
      ],
      exports: [ApiClientService, HTTP_CLIENT, REQUEST_LOGGER, ERROR_HANDLER],
    };
  }

  /**
   * Register the module with async configuration
   */
  static registerAsync(options: {
    imports?: any[];
    useFactory: (...args: any[]) => ApiConfig | Promise<ApiConfig>;
    inject?: any[];
  }): DynamicModule {
    const providers: Provider[] = [
      {
        provide: ApiConfig,
        useFactory: options.useFactory,
        inject: options.inject || [],
      },
      {
        provide: REQUEST_LOGGER,
        useClass: RequestLoggerService,
      },
      {
        provide: ERROR_HANDLER,
        useClass: ErrorHandlerService,
      },
      {
        provide: HTTP_CLIENT,
        useClass: HttpClientService,
      },
      ApiClientService,
    ];

    return {
      module: CustomAxiosModule,
      imports: [...(options.imports || []), HttpModule],
      providers,
      exports: [ApiClientService, HTTP_CLIENT, REQUEST_LOGGER, ERROR_HANDLER],
    };
  }
}
