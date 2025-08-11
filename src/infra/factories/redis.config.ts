import { registerAs } from '@nestjs/config';

/**
 * Register `redis` over environment
 */
export default registerAs('redis', () => {
  let auth = '';

  const host = process.env.REDIS_HOST ?? 'localhost';
  const port = process.env.REDIS_PORT ?? '6379';
  const db = process.env.REDIS_DB ? `/${process.env.REDIS_DB}` : '';

  return {
    host,
    port,
    user: process.env.USERNAME,
    password: process.env.REDIS_PASSWORD,
    secure: process.env.REDIS_SECURE === 'true',
    db: process.env.REDIS_DB,
    redisUrl: `redis://${auth}${host}:${port}${db}`,
  };
});
