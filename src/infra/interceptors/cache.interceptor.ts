import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CACHE_TTL, IRedisService, NO_CACHE } from '../modules/cache';
import { createHash } from 'crypto';
import { Reflector } from '@nestjs/core';
import { JWTTokenUtil } from '@app/shared/utils';
import { ITokenPayload } from '@app/shared/decorators/api-token-property.decorator';
import { jwtDecode } from 'jwt-decode';

function shouldCacheResult(data: any): boolean {
  if (data == null) return false;

  if (Array.isArray((data as any)?.data)) {
    const count =
      typeof (data as any)?.meta?.count === 'number'
        ? (data as any).meta.count
        : (data as any).data.length;
    return count > 0;
  }

  if (Array.isArray(data)) return data.length > 0;

  if (typeof data === 'object') return Object.keys(data).length > 0;

  return true;
}

function getPathname(url: string): string {
  try {
    return new URL(url, 'http://local').pathname;
  } catch {
    return url.split('?')[0] ?? url;
  }
}

function resolveUserId(req: any): string {
  try {
    const auth = req?.headers?.authorization as string | undefined;
    const token = auth?.startsWith('Bearer ') ? auth.slice(7) : undefined;
    if (!token) return 'no-token';

    const payload = JWTTokenUtil.getTokenPayload(token);
    return payload?.userId ? String(payload.userId) : 'no-token';
  } catch {
    return 'no-token';
  }
}

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CacheInterceptor.name);

  constructor(
    private readonly redis: IRedisService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request & { user?: any }>();
    const res = http.getResponse();

    const noCache = this.reflector.getAllAndOverride<boolean>(NO_CACHE, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (noCache) return next.handle();

    const method = (req.method || 'GET').toUpperCase();
    if (method !== 'GET') return next.handle();

    const ttlMs =
      this.reflector.getAllAndOverride<number>(CACHE_TTL, [
        context.getHandler(),
        context.getClass(),
      ]) ?? 60_000;

    const rawUrl = (req as any).originalUrl || (req as any).url || '';
    const pathname = getPathname(rawUrl);
    const userId = resolveUserId(req);

    const prefix = `api-cache:${pathname}:u:${userId}`;
    const versionKey = `cache:ver:${prefix}`;
    const version = (await this.redis.get<number>(versionKey)) ?? 1;

    const keyHash = `${method}:${rawUrl}:${userId}`;

    const key = `${prefix}:v${version}:${createHash('sha256')
      .update(keyHash)
      .digest('hex')}`;

    const cached = await this.redis.get<any>(key);
    if (cached !== null && cached !== undefined) {
      this.logger.log(`HIT ${method} ${rawUrl} -> ${key}`);
      return of(cached);
    }

    this.logger.log(`MISS ${method} ${rawUrl} -> ${key}`);

    return next.handle().pipe(
      tap({
        next: async (data) => {
          try {
            const status = (res as any)?.statusCode ?? 200;
            if (status === 200 && shouldCacheResult(data)) {
              await this.redis.save(key, data, ttlMs);
            } else {
              this.logger.debug(
                `Skip cache (status=${status}, shouldCache=${shouldCacheResult(
                  data,
                )})`,
              );
            }
          } catch (e) {
            this.logger.warn(`Cache save error: ${(e as Error).message}`);
          }
        },
      }),
    );
  }
}
