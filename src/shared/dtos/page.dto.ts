import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from './page-meta.dto';

export class PageDto<T> {
  @ApiProperty({
    isArray: true,
    description: 'Array of data items for the current page',
    example: [],
  })
  readonly data: T[];

  @ApiProperty({
    type: () => PageMetaDto,
    description:
      'Pagination metadata including page information and navigation flags',
  })
  readonly meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
