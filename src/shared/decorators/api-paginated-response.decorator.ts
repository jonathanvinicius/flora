import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { PageDto } from '../dtos';

interface IPaginatedDecoratorApiResponse<T> {
  type: Type<any & T>;
  description?: string;
  operationDescription?: string;
}
/**
 * Response pagination swagger docs
 */
export const ApiPaginatedResponse = <TModel extends Type<any>>(
  options: IPaginatedDecoratorApiResponse<TModel>,
) => {
  return applyDecorators(
    ApiOperation({
      description: options.operationDescription || options.description,
    }),
    ApiExtraModels(PageDto<TModel>, options.type),
    ApiOkResponse({
      description: options.description || 'Successfully received model list',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(options.type) },
              },
              page: { type: 'number', example: 1 },
              limit: { type: 'number', example: 20 },
              total: { type: 'number', example: 1 },
              pages: { type: 'number', example: 100 },
              hasPreviousPage: { type: 'boolean', example: true },
              hasNextPage: { type: 'boolean', example: true },
            },
          },
        },
      },
    }),
  );
};
