// redis-config.factory.ts
import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createKeyv } from '@keyv/redis';
import { IRedisConfig } from '@app/infra/interfaces/redis.config.interface';

@Injectable()
export class RedisConfigFactory implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  async createCacheOptions(): Promise<CacheModuleOptions> {
    const redisConfig = this.configService.get<IRedisConfig>('redis');

    if (!redisConfig?.host || !redisConfig?.port) {
      return { isGlobal: true };
    }

    return {
      isGlobal: true,
      stores: [createKeyv(redisConfig.redisUrl)],
      ttl: 0,
    };
  }
}
