import { JWTTokenUtil } from '@app/shared/utils';
import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export interface ITokenPayload {
  userId: string;
}

export const ApiTokenProperty = createParamDecorator(
  (_, ctx: ExecutionContext): ITokenPayload => {
    try {
      const request = ctx.switchToHttp().getRequest();
      const tokenHeader = request.headers['authorization'].split(' ')[1];

      const user = JWTTokenUtil.getTokenPayload(tokenHeader);

      return user;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  },
);
