import { ErrorDefinitions } from '@app/domain/errors';
import { ErrorHelper } from '@app/shared/helpers';
import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

/**
 * Request parameters in header decorator
 */
export const RequestHeader = createParamDecorator(
  async (value: any, ctx: ExecutionContext) => {
    // extract headers
    const headers = ctx.switchToHttp().getRequest().headers;
    // Convert headers to DTO object
    const plainInstance = plainToInstance(value, headers, {
      excludeExtraneousValues: true,
    });

    const errors = await validate(plainInstance);

    if (errors.length > 0) {
      const validatorErrors = ErrorHelper.mapValidationErrors(errors);
      throw new BadRequestException({
        errorDefinition: ErrorDefinitions.MISSING_OR_INVALID_PARAMS,
        validatorErrors,
      });
    }

    return plainInstance;
  },
);
