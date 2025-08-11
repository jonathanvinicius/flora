import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { createHash } from 'crypto';
import { RedisService } from './redis.service';

describe('RedisService', () => {
  let service: RedisService;

  const mockCacheManager = {
    get: jest.fn<Promise<any>, [string]>(),
    set: jest.fn<Promise<void>, [string, any, any]>(),
    del: jest.fn<Promise<any>, [string]>(),
    reset: jest.fn<Promise<void>, []>(),
    store: {
      keys: jest.fn<Promise<string[]>, []>(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get(RedisService);

    // Limpar chamadas entre testes
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should return value from cache', async () => {
      mockCacheManager.get.mockResolvedValueOnce('value');
      const result = await service.get<string>('key');
      expect(result).toBe('value');
      expect(mockCacheManager.get).toHaveBeenCalledWith('key');
    });

    it('should return null on error', async () => {
      mockCacheManager.get.mockRejectedValueOnce(new Error('fail'));
      const result = await service.get<string>('key');
      expect(result).toBeNull();
    });
  });

  describe('getStartsWith', () => {
    it('should return values with matching prefix', async () => {
      mockCacheManager.store.keys.mockResolvedValue([
        'prefix:1',
        'prefix:2',
        'other',
      ]);
      mockCacheManager.get
        .mockResolvedValueOnce('value1')
        .mockResolvedValueOnce('value2');
      const result = await service.getStartsWith<string>('prefix');
      expect(result).toEqual(['value1', 'value2']);
    });

    it('should return null on error', async () => {
      mockCacheManager.store.keys.mockRejectedValue(new Error('fail'));
      const result = await service.getStartsWith<string>('prefix');
      expect(result).toBeNull();
    });
  });

  describe('hasCache', () => {
    it('should return true if value exists', async () => {
      mockCacheManager.get.mockResolvedValueOnce('data');
      const result = await service.hasCache('key');
      expect(result).toBe(true);
    });

    it('should return false if value is null', async () => {
      mockCacheManager.get.mockResolvedValueOnce(null);
      const result = await service.hasCache('key');
      expect(result).toBe(false);
    });

    it('should return false on error', async () => {
      mockCacheManager.get.mockRejectedValue(new Error('fail'));
      const result = await service.hasCache('key');
      expect(result).toBe(false);
    });
  });

  describe('save', () => {
    it('should save with default TTL (0)', async () => {
      await service.save('key', 'data');
      expect(mockCacheManager.set).toHaveBeenCalledWith('key', 'data', {
        ttl: 0,
      });
    });

    it('should save with custom TTL', async () => {
      await service.save('key', 'data', 100);
      expect(mockCacheManager.set).toHaveBeenCalledWith('key', 'data', {
        ttl: 100,
      });
    });

    it('should log error on failure', async () => {
      mockCacheManager.set.mockRejectedValueOnce(new Error('fail'));
      await expect(service.save('key', 'data')).resolves.toBeUndefined();
    });
  });

  describe('delete', () => {
    it('should return true when deleted', async () => {
      mockCacheManager.del.mockResolvedValueOnce(1);
      const result = await service.delete('key');
      expect(result).toBe(true);
    });

    it('should return false if deletion returns undefined', async () => {
      mockCacheManager.del.mockResolvedValueOnce(undefined);
      const result = await service.delete('key');
      expect(result).toBe(false);
    });

    it('should handle error gracefully', async () => {
      mockCacheManager.del.mockRejectedValueOnce(new Error('fail'));
      await expect(service.delete('key')).resolves.toBeUndefined();
    });
  });

  describe('clear', () => {
    it('should call reset', async () => {
      await service.clear();
      expect(mockCacheManager.reset).toHaveBeenCalled();
    });
  });

  describe('createKey', () => {
    it('should return sha256 hash', () => {
      const input = 'test-key';
      const expected = createHash('sha256').update(input).digest('hex');
      expect(service.createKey(input)).toBe(expected);
    });
  });
});
