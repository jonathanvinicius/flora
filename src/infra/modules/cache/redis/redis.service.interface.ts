/**
 * Redis interface
 */
export abstract class IRedisService {
  /**
   * Get cache by key
   */
  abstract get<T>(key: string): Promise<T>;

  /**
   * Check exists data
   */
  abstract hasCache(key: string): Promise<boolean>;

  /**
   * Save data in cache
   *
   * If expireat is undefined data never expired
   *
   * @param {number} expireat Time in seconds
   */
  abstract save(key: string, data: any, expireat?: number): Promise<any>;

  /**
   * Delete cache by key
   * @param key Chave
   */
  abstract delete(key: string): Promise<any>;

  /**
   * Clear all data cache
   */
  abstract clear(): Promise<void>;

  /**
   * Create key sha256
   *
   * Use this for redis key
   */
  abstract createKey(value: string): string;

  abstract bumpVersion(prefix: string): Promise<void>;
}
