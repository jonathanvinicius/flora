import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  FilterExceptionInterceptor,
  LoggingInterceptor,
} from './infra/interceptors';
import { AppInterceptor } from './infra/interceptors';
import { loadConfig } from './infra/config/load.config';
import { SequelizePostgresFactory } from './infra/providers';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards';
import { I18nModule } from './infra/modules/i18n';
import { WordModule } from './modules/words/word.module';
import { RabbitMqConfigManager } from './infra/modules/rabbitmq/src/templates/rabbitmq-config.manager';
import { AppService } from './app.service';
import { RedisModule } from './infra/modules/cache';
import { UserModule } from './modules/users/user.module';

@Module({
  imports: [
    //Config module
    ConfigModule.forRoot({
      load: [async () => loadConfig()],
      isGlobal: true,
    }),
    // Orm
    SequelizeModule.forRootAsync({
      useClass: SequelizePostgresFactory,
    }),

    //Auth
    AuthModule,
    I18nModule,
    WordModule,
    RedisModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    {
      /**
       * Use an interceptor to set default response { data }
       */
      provide: APP_INTERCEPTOR,
      useClass: AppInterceptor,
    },
    /**
     * Global interceptors used across the whole application
     */
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    FilterExceptionInterceptor,
    RabbitMqConfigManager,
    AppService,
  ],
})
export class AppModule {}
