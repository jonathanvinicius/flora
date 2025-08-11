import { PageOptionsDto } from '../../../../../shared/dtos';
import { Type } from '@nestjs/common';
import { GroupOption, Includeable, Order, WhereOptions } from 'sequelize';
export interface CriteriaOptions<T> {
  /**
   * Pagination options
   */
  pageOptions: PageOptionsDto;
  /**
   * Attribute has to be matched for rows to be selected for the given action.
   */
  criteria?: WhereOptions<T>;
  /**
   * Include options. See `find` for details
   */
  include?: Includeable | Includeable[];
  /**
   * Specifies an ordering. If a string is provided, it will be escaped. Using an array, you can provide
   * several columns / functions to order by. Each element can be further wrapped in a two-element array. The
   * first element is the column / function to order by, the second is the direction. For example:
   * `order: [['name', 'DESC']]`. In this way the column will be escaped, but the direction will not.
   */
  order?: Order | string[];
  /**
   * Class object to be converts plain (literal)
   */
  cls?: Type;

  attributes?: string[];

  raw?: boolean;

  subquery?: boolean;

  distinct?: boolean;
}

export interface CriteriaOptionsGroup<T> extends CriteriaOptions<T> {
  /**
   * GROUP BY in sql
   */
  group?: GroupOption;
  /**
   * Class object to be converts plain (literal)
   */
  cls?: Type;
}
