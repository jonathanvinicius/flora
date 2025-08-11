import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { createHash } from 'crypto';
import { RedisService } from '../redis.service';
import { PERSIST_CACHE } from '../../cache.constants';

const createCacheManagerMock = () => ({
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  clear: jest.fn(),
  reset: jest.fn(),
  store: { keys: jest.fn() },
});

describe('RedisService', () => {
  let service: RedisService;
  const mockCacheManager = createCacheManagerMock();

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    service = moduleRef.get(RedisService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('returns value from cache', async () => {
      mockCacheManager.get.mockResolvedValueOnce('value');
      const result = await service.get<string>('key');
      expect(result).toBe('value');
      expect(mockCacheManager.get).toHaveBeenCalledWith('key');
    });

    it('returns null on error', async () => {
      mockCacheManager.get.mockRejectedValueOnce(new Error('fail'));
      await expect(service.get<string>('key')).resolves.toBeNull();
    });
  });

  describe('hasCache', () => {
    it('returns true if value exists', async () => {
      mockCacheManager.get.mockResolvedValueOnce('data');
      await expect(service.hasCache('key')).resolves.toBe(true);
    });

    it('returns false if value is null', async () => {
      mockCacheManager.get.mockResolvedValueOnce(null);
      await expect(service.hasCache('key')).resolves.toBe(false);
    });

    it('returns false on error', async () => {
      mockCacheManager.get.mockRejectedValueOnce(new Error('fail'));
      await expect(service.hasCache('key')).resolves.toBe(false);
    });
  });

  describe('save', () => {
    it('saves with default TTL (PERSIST_CACHE)', async () => {
      await service.save('key', 'data');
      expect(mockCacheManager.set).toHaveBeenCalledWith(
        'key',
        'data',
        PERSIST_CACHE,
      );
    });

    it('saves with custom TTL', async () => {
      await service.save('key', 'data', 100);
      expect(mockCacheManager.set).toHaveBeenCalledWith('key', 'data', 100);
    });

    it('swallows error, logs, and resolves', async () => {
      mockCacheManager.set.mockRejectedValueOnce(new Error('fail'));
      await expect(service.save('key', 'data')).resolves.toBeUndefined();
    });
  });

  describe('delete', () => {
    it('returns true when deleted (not undefined)', async () => {
      mockCacheManager.del.mockResolvedValueOnce(1);
      await expect(service.delete('key')).resolves.toBe(true);
    });

    it('returns false when deletion returns undefined', async () => {
      mockCacheManager.del.mockResolvedValueOnce(undefined);
      await expect(service.delete('key')).resolves.toBe(false);
    });

    it('swallows error and resolves', async () => {
      mockCacheManager.del.mockRejectedValueOnce(new Error('fail'));
      await expect(service.delete('key')).resolves.toBeUndefined();
    });
  });

  describe('clear', () => {
    it('calls cacheManager.clear', async () => {
      mockCacheManager.clear.mockResolvedValueOnce(undefined);
      await service.clear();
      expect(mockCacheManager.clear).toHaveBeenCalledTimes(1);
    });
  });

  describe('createKey', () => {
    it('returns sha256 hash', () => {
      const input = 'test-key';
      const expected = createHash('sha256').update(input).digest('hex');
      expect(service.createKey(input)).toBe(expected);
    });
  });

  describe('bumpVersion', () => {
    it('when no version set: saves 2 with ttl 0', async () => {
      mockCacheManager.get.mockResolvedValueOnce(undefined);
      await service.bumpVersion('user_favorites:u1');
      expect(mockCacheManager.set).toHaveBeenCalledWith(
        'cache:ver:user_favorites:u1',
        2,
        0,
      );
    });

    it('when version=5: saves 6 with ttl 0', async () => {
      mockCacheManager.get.mockResolvedValueOnce(5);
      await service.bumpVersion('user_favorites:u2');
      expect(mockCacheManager.set).toHaveBeenCalledWith(
        'cache:ver:user_favorites:u2',
        6,
        0,
      );
    });
  });
});
