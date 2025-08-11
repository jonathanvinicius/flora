import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';
import { Ii18nService, Languages } from '../modules/i18n';
import { I18N_TOKENS } from '../modules/i18n/tokens';

@Catch()
export class FilterExceptionInterceptor implements ExceptionFilter {
  private readonly logger = new Logger(FilterExceptionInterceptor.name);

  constructor(
    @Inject(I18N_TOKENS.I18N_SERVICE)
    private readonly i18n: Ii18nService,
  ) {}

  private pickLang(req: Request): Languages {
    const h = (req.headers['accept-language'] || '').toString().toLowerCase();
    if (h.startsWith('en')) return Languages.EN;

    return Languages.PT;
  }

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp() as HttpArgumentsHost;
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status: number = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const lang = this.pickLang(request);

    const raw =
      isHttpException && typeof exception.getResponse === 'function'
        ? exception.getResponse()
        : null;
    const payload = (
      typeof raw === 'string' ? { message: raw } : raw ?? {}
    ) as Record<string, any>;

    const translateSafe = async (key?: string) => {
      if (!key) return null;
      try {
        const msg = await this.i18n.translate(key, lang);
        return msg && msg !== key ? msg : null;
      } catch {
        return null;
      }
    };

    const messageCode =
      payload?.errorDefinition?.messageCode ??
      payload?.messageCode ??
      (typeof payload?.message === 'string' ? payload.message : undefined);

    let error: string | string[] | null =
      (await translateSafe(messageCode)) ??
      (Array.isArray(payload?.message)
        ? payload.message.join('\n')
        : payload?.message) ??
      exception?.message ??
      null;

    const statusLogger = [
      HttpStatus.REQUEST_TIMEOUT,
      HttpStatus.TOO_MANY_REQUESTS,
      HttpStatus.INTERNAL_SERVER_ERROR,
    ];
    let exceptionCode: number | undefined;

    if (statusLogger.includes(status) || status) {
      const msg = `Request: ${request.url}, status: ${status}`;

      this.logger.error(msg, JSON.stringify(payload ?? exception));
    }

    if (status === HttpStatus.TOO_MANY_REQUESTS) {
      error =
        (await translateSafe('error.TOO_MANY_REQUESTS')) ?? 'Too Many Requests';
    } else if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      exceptionCode = exception?.response?.status ?? status;
      error =
        (await translateSafe('error.INTERNAL')) ?? error ?? 'Internal error';
      this.logger.error('Stack:' + exception?.stack);
    }

    const data = {
      details: payload?.details,
      message: error ?? 'Unexpected error',
      code: status,
      statusText: HttpStatus[status],
      log: 'Request failed at ' + new Date().toISOString(),
      path: request.originalUrl,
      exceptionCode,
    };
    this.logger.error(`Internal-Exception ${JSON.stringify(data)}`);
    return response.status(status).json({ data });
  }
}
