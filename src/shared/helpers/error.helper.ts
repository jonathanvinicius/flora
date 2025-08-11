import { ErrorDefinitions } from '@app/domain/errors';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ErrorCode, LogCodeType, LogPrefix } from '../../domain/enums';
import { ErrorResponse } from '../responses/error.response';
import { ValidationErrorItem } from '../dtos/validation-error.dto';

export class ErrorHelper {
  /**
   * Maps NestJS HttpStatus to ErrorCode
   */
  private static statusToErrorCode(status: HttpStatus): ErrorCode {
    const error = ErrorCode[status];
    if (error) {
      return error;
    }
    return ErrorCode.INTERNAL_SERVER_ERROR;
  }

  /**
   * Creates a standardized error response
   */
  static createErrorResponse(
    status: HttpStatus,
    message: string,
    errorCode?: ErrorCode,
    validatorErrors?: ValidationErrorItem[],
  ): ErrorResponse {
    return {
      code: errorCode || this.statusToErrorCode(status),
      statusCode: status,
      statusCodeAsString: HttpStatus[status],
      description: message,
      ...(validatorErrors && { validatorErrors }),
    };
  }

  /**
   * Maps specific exception types to custom error codes
   */
  static mapExceptionToErrorCode(exception: any): ErrorCode {
    const errorCode =
      exception?.response?.errorDefinition?.code ||
      HttpStatus[exception?.status] ||
      exception?.name ||
      ErrorDefinitions.GENERIC_ERROR.code;
    return errorCode;
  }

  /**
   * Algorithm Breadth-first
   * The function processes each validation error and its nested children, constructing a property path and collecting
   * relevant constraint messages for each error.
   *
   * @param errors - The list of validation errors to be processed.
   * @returns A flat array of error items, each containing a property path and associated validation messages.
   */

  static mapValidationErrors(errors: ValidationError[]): ValidationErrorItem[] {
    const groupedErrors: ValidationErrorItem[] = [];
    const queue: { error: ValidationError; path: string }[] = [];

    errors.forEach((error) => queue.push({ error, path: '' }));

    while (queue.length > 0) {
      const { error, path } = queue.shift();

      const propertyPath = path ? `${path}.${error.property}` : error.property;

      if (error.constraints) {
        groupedErrors.push({
          property: propertyPath,
          messages: Object.values(error.constraints),
        });
      }

      if (error.children && error.children.length > 0) {
        error.children.forEach((child) =>
          queue.push({ error: child, path: propertyPath }),
        );
      }
    }

    return groupedErrors;
  }

  /**
   * Retrieves the HTTP status from the given exception.
   * Defaults to 500 if it's not an instance of HttpException.
   */

  static getStatus(exception: any) {
    return exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
  }

  /**
   * Retrieves the i18n message code from the exception or falls back to a default internal server error message code.
   */

  static getMessageCode(exception: any): string {
    return (
      exception?.response?.errorDefinition?.messageCode ||
      exception?.response?.message ||
      exception?.message ||
      ErrorDefinitions.INTERNAL_SERVER_ERROR.messageCode
    );
  }

  /**
   * Determines whether the exception should be exposed to the client or not.
   * Returns true if it's not explicitly marked as exposed or lacks an error definition.
   */

  static shouldExposeToClient(exception: any): boolean {
    const isHttpException = exception instanceof HttpException;
    return (
      !exception?.response?.isExposedToClient ||
      !exception?.response?.errorDefinition ||
      !isHttpException
    );
  }

  /**
   * Generates a consistent 3-digit numeric hash based on the input string.
   * Useful for mapping string-based identifiers (e.g., error codes, feature flags)
   * into compact numeric representations without storing a manual mapping.
   *
   * The result is always a positive number between 0 and 999.
   *
   * @param str - The input string to hash.
   * @returns A 3-digit number derived from the input string.
   *
   * @example
   * toHash("NOT_FOUND"); // returns 411
   * toHash("BAD_REQUEST"); // returns 752
   */

  static toHash(str: string): number {
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }

    return Math.abs(hash % 1000);
  }

  /**
   * Builds a standardized log code for observability and tracking.
   *
   * @param exception - The exception object, typically from an HTTP context.
   * @param modulePrefix - 3-letter code identifying the service/module (e.g., "WSV").
   * @param type - Log type: E (Error), S (Success), H (History), I (Info)
   * @param areaCode - Area code: 10, 20, 30, etc.
   * @returns A formatted log code string.
   */
  static buildCode(
    exception: any,
    modulePrefix: LogPrefix,
    type: LogCodeType,
    areaCode: string = '10',
  ): string {
    const statusGeneric = 999;
    const status = exception?.status || statusGeneric;
    const statusAsString =
      (HttpStatus[exception?.status] as any) || exception?.name;
    const messageCode = ErrorHelper.getMessageCode(exception);
    const message = `${statusAsString}${messageCode}`;
    const sequence = ErrorHelper.toHash(message).toString().padStart(3, '0');

    return `${modulePrefix}-${type}${areaCode}${status}${sequence}`;
  }

  /**
   * Builds a raw log message.
   *
   * Format: <RAW> - Message
   * Example: Acquirer toggle not found
   */

  static buildMessage(expection): string {
    const message = ErrorHelper.getMessageCode(expection);
    return message;
  }
}
