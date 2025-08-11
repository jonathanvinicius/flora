import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Capture authorization property from header
 */
export const ApiToken = createParamDecorator(
  (_, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const tokenHeader = request.headers['authorization'];
    return tokenHeader;
  },
);
