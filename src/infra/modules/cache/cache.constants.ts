import { SetMetadata } from '@nestjs/common';

/**Cache No Limit */
export const PERSIST_CACHE = 0;

/**Time seconds */
export const CACHE_1_MINUTE = 60;

/**Time seconds */
export const CACHE_2_MINUTES = 120;

/**Time seconds */
export const CACHE_5_MINUTES = 300;

/**Time seconds */
export const CACHE_10_MINUTES = 600;

/**Time seconds */
export const CACHE_30_MINUTES = 1800;

/**Time seconds */
export const CACHE_1_HR = 3600;

/**Time seconds */
export const CACHE_1_DAY = 86400;

/** Key Redis App Cache Array */
export const APPS_KEY_CACHE = 'AppsRegisteredCache';

export const CACHE_TTL = 'cache_ttl_ms';
export const NO_CACHE = 'no_cache';

export const CacheTTL = (ms: number) => SetMetadata(CACHE_TTL, ms);
export const NoCache = () => SetMetadata(NO_CACHE, true);
