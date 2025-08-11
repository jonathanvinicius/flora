import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';

interface IResponseDecoratorApiResponse<T> {
  type: Type<any | T> | 'binary';
  isArray?: boolean;
  description?: string;
  summary?: string;
  operationDescription?: string;
  status?: HttpStatus;
}
/**
 * Response data swagger docs
 */
export const ApiDataResponse = <TModel extends Type<any>>(
  options: IResponseDecoratorApiResponse<any | TModel>,
) => {
  const status = options.status ?? HttpStatus.OK;
  if (options.type === 'binary') {
    return ApiResponse({
      status: status,
      description: options.description || HttpStatus[status],
      schema: {
        type: 'string',
        format: 'binary',
      },
    });
  }
  let response = ApiResponse({
    status: status,
    description: options.description || HttpStatus[status],
    schema: {
      $ref: getSchemaPath(options.type),
    },
  });
  if (options.isArray === true) {
    response = ApiResponse({
      status: status,
      description: options.description || HttpStatus[status],
      schema: {
        properties: {
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(options.type) },
          },
        },
      },
    });
  }

  return applyDecorators(
    ApiOperation({
      summary: options.summary,
      description: options.operationDescription || options.description,
    }),
    ApiExtraModels(options.type),
    response,
  );
};
