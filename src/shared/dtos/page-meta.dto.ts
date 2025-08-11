import { ApiProperty } from '@nestjs/swagger';
import { PageOptionsDto } from './page-options.dto';

export interface PageMetaDtoParameters {
  pageOptions: PageOptionsDto;
  count: number;
}

export class PageMetaDto {
  @ApiProperty({
    description: 'Current page number',
    example: 1,
    minimum: 1,
  })
  readonly page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 50,
  })
  readonly limit: number;

  @ApiProperty({
    description: 'Total number of items across all pages',
    example: 25,
    minimum: 0,
  })
  readonly count: number;

  @ApiProperty({
    description: 'Total number of pages available',
    example: 3,
    minimum: 0,
  })
  readonly pageCount: number;

  @ApiProperty({
    description: 'Whether there is a previous page available',
    example: false,
  })
  readonly hasPreviousPage: boolean;

  @ApiProperty({
    description: 'Whether there is a next page available',
    example: true,
  })
  readonly hasNextPage: boolean;

  constructor({ pageOptions, count }: PageMetaDtoParameters) {
    this.page = pageOptions.page;
    this.limit = pageOptions.limit;
    this.count = count;
    this.pageCount = Math.ceil(this.count / this.limit);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
