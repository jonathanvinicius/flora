import { IS_PUBLIC_KEY } from '@app/shared/decorators';
import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    //valida public route
    const isPublic = this.handlePublicRoute(context);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err: Error, user: any, info: any) {
    if (err || !user) {
      let message: string = info?.message;
      if (
        message.includes('expired') ||
        message.includes('malformed') ||
        message.includes('signature')
      ) {
        message = `Token ${message}`;
      }

      throw err || new ForbiddenException(message);
    }
    return user;
  }

  handlePublicRoute(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    return isPublic;
  }
}
