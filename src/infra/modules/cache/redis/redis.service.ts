import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { createHash } from 'crypto';
import { IRedisService } from './redis.service.interface';
import { PERSIST_CACHE } from '../cache.constants';

@Injectable()
export class RedisService implements IRedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  private logger = new Logger(RedisService.name);
  /**
   * Get cache by key
   */
  async get<T>(key: string): Promise<T> {
    try {
      return await this.cacheManager.get<T>(key);
    } catch (error) {
      this.logger.error(`get ${key} error: ${error.message}`);
      return null;
    }
  }

  /**
   * Check exists data
   */
  async hasCache(key: string): Promise<boolean> {
    try {
      const cacheData = await this.cacheManager.get(key);
      return cacheData != null;
    } catch (error) {
      this.logger.error(`hasCache ${key} error: ${error.message}`);
      return false;
    }
  }
  /**
   * Save data in cache
   *
   * If expireat is undefined data never expired
   *
   * @param {number} expireat Time in seconds
   */
  async save(key: string, data: any, expireat?: number): Promise<any> {
    try {
      //TTL (Time-To-Live)
      //To disable expiration of the cache, set the ttl configuration property to 0:
      const ttl = expireat || PERSIST_CACHE;
      return await this.cacheManager.set(key, data, ttl);
    } catch (error) {
      this.logger.error(`set ${key} error: ${error.message}`);
    }
  }

  /**
   * Delete cache by key
   * @param key Chave
   */
  async delete(key: string): Promise<any> {
    try {
      const deleted = await this.cacheManager.del(key);
      return deleted !== undefined;
    } catch (error) {
      this.logger.error(`del ${key} error: ${error.message}`);
    }
  }

  /**
   * Clear all data cache
   */
  async clear() {
    await this.cacheManager.clear();
  }

  /**
   * Create key sha256
   *
   * Use this for redis key
   */
  createKey(value: string): string {
    return createHash('sha256').update(value).digest('hex');
  }

  async bumpVersion(prefix: string): Promise<void> {
    const key = `cache:ver:${prefix}`;
    const curr = (await this.get<number>(key)) ?? 1;
    await this.save(key, curr + 1, 0);
  }
}
