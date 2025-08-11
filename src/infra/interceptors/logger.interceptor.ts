import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger(LoggingInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    //To handle request/response
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    // Log request details
    this.logger.log(`Request URL ${request.method}: ${request.originalUrl}`);

    if (request.body && Object.keys(request.body).length > 0) {
      this.logger.log(`Body: ${JSON.stringify(request.body)}`);
    }

    // Log headers but filter out sensitive information
    const filteredHeaders = { ...request.headers };
    if (filteredHeaders.authorization) {
      filteredHeaders.authorization = '[FILTERED]';
    }

    this.logger.log(`Headers: ${JSON.stringify(filteredHeaders)}`);

    return next.handle().pipe(
      tap((data: any) => {
        if (data) {
          this.logger.log(`Response: ${JSON.stringify(data)}`);
        }
      }),
    );
  }
}
