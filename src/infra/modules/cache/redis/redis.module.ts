import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisConfigFactory } from './providers/redis-config.factory';
import { RedisService } from './redis.service';
import { IRedisService } from './redis.service.interface';

const ConfigFactory = {
  provide: 'REDIS_FACTORY',
  useFactory: (config: ConfigService) => {
    return config;
  },
  inject: [ConfigService],
};

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useClass: RedisConfigFactory,
    }),
  ],
  providers: [
    ConfigFactory,
    {
      provide: IRedisService,
      useClass: RedisService,
    },
  ],
  exports: [
    'REDIS_FACTORY',
    {
      provide: IRedisService,
      useClass: RedisService,
    },
  ],
})
export class RedisModule {}
