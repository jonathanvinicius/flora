import {
  ArgumentMetadata,
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

/**
 * Custom validation
 */
export class CustomValidation extends ValidationPipe {
  constructor() {
    super({ transform: true });
  }

  private shouldValidate(metatype?: Function): boolean {
    const skip: Function[] = [String, Boolean, Number, Array, Object];
    return !!metatype && !skip.includes(metatype);
  }
  /**
   * Transform data
   */
  override async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!this.shouldValidate(metatype)) return value;

    const object = plainToInstance(metatype, value ?? {});

    const errors: ValidationError[] = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: false,
    });

    if (errors.length > 0) {
      const details = errors
        .flatMap((e) => Object.values(e.constraints ?? {}))
        .filter(Boolean);

      throw new BadRequestException({
        messageCode: 'error.VALIDATION',
        details,
      });
    }

    return object;
  }
}
