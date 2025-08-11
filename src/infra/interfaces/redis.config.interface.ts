export interface IRedisConfig {
  host: string;
  port: string;
  user?: string;
  password?: string;
  secure: boolean;
  db: string;
  redisUrl: string;
}
