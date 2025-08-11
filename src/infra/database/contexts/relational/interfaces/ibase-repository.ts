import { ClassConstructor } from 'class-transformer';
import {
  Attributes,
  FindOptions,
  GroupOption,
  Includeable,
  WhereOptions,
} from 'sequelize';
import { CriteriaOptions } from '.';
import { BaseModel } from '../base/base.model';
import { PageDto, PageOptionsDto } from '../../../../../shared/dtos';

export interface IBaseRepository<T extends BaseModel> {
  create(data: T, options?: any): any;

  save(data: T): any;

  update(id: any, partialData: Partial<T>): any;

  findById(id: string | number): Promise<T>;

  findByUuid(uuid: string): Promise<T>;

  findOne(
    options: FindOptions<Attributes<T>>,
    cls?: ClassConstructor<any>,
  ): Promise<T>;

  find(
    options: FindOptions<Attributes<T>>,
    cls?: ClassConstructor<any>,
  ): Promise<T[]>;

  findWithPagination(
    pageOptions: PageOptionsDto,
    criteria: WhereOptions<T>,
    order?: string[],
    cls?: ClassConstructor<any>,
    include?: Includeable | Includeable[],
  ): Promise<PageDto<T>>;

  findWithPagination(options: CriteriaOptions<T>): Promise<PageDto<T>>;

  findGroupBy(
    criteria: WhereOptions<T>,
    group: GroupOption,
    order?: string[],
    include?: Includeable | Includeable[],
  ): Promise<BaseModel[]>;

  delete(criteria: WhereOptions<T>): any;
}
