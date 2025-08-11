import { Type } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import {
  FindAttributeOptions,
  FindOptions,
  GroupOption,
  Includeable,
  Op,
  QueryOptions,
  QueryOptionsWithType,
  QueryTypes,
  Sequelize,
  WhereOptions,
} from 'sequelize';

import { CriteriaOptions, IBaseRepository } from '../interfaces';
import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
} from '../../../../../shared/dtos';
import { BaseModel } from './base.model';
//settings for parse decimal properties to number
(Sequelize as any).DataTypes.postgres.DECIMAL.parse = parseFloat;

export abstract class BaseRepository<T extends BaseModel>
  implements IBaseRepository<T>
{
  private constructorName: string;
  constructor(
    protected repository: typeof BaseModel,
    protected cls?: ClassConstructor<any>,
  ) {
    this.constructorName = this.constructor.name;
  }

  /**
   * Create data
   */
  async create(data: Partial<T>, options?: any): Promise<T | null> {
    try {
      const result = await this.repository.create(data, options); // Incluindo as opções aqui
      return this.toPlainInstance(result); // Converte para a classe, se necessário
    } catch (error) {
      throw new Error(
        `Error trying to create model ${this.constructorName}: ${error.message}`,
      );
    }
  }

  /**
   * Persist data
   */
  async save(data: Partial<T>, options?: any): Promise<T | null> {
    try {
      const result = this.repository.create(data, options);
      return this.toPlainInstance(result);
    } catch (error) {
      throw new Error(
        `Error trying to save that model ${this.constructorName}: ${error.message}`,
      );
    }
  }
  /**
   * Update data by id
   * @param id Primary key
   */
  async update(
    id: number,
    data: Partial<T>,
    returning?: boolean,
  ): Promise<any> {
    try {
      const result = await this.repository.update(data, {
        where: { id: id },
      });

      if (returning) {
        return this.toPlainInstance(result);
      }

      return result.length > 0;
    } catch (error) {
      throw new Error(
        `Error trying to updating that model ${this.constructorName}: ${error.message}`,
      );
    }
  }

  /**
   * Update data by id
   * @param id Primary key
   */
  async updateMany(ids: number[], data: Partial<T>) {
    try {
      const result = await this.repository.update(data, {
        where: { id: { [Op.in]: ids } },
      });

      return result[0] > 0; // Retorna o número de linhas afetadas
    } catch (error) {
      throw new Error(
        `Error trying to update models ${this.constructorName}: ${error.message}`,
      );
    }
  }

  /**
   * Search for a single instance by its primary key. This applies LIMIT 1, so the listener will always be called with a single instance.
   * @param id Primary key
   * @param options Additional Sequelize options such as includes, where, etc.
   * @param cls Optional class constructor for transforming the result
   */
  async findById(
    id: number,
    options?: FindOptions<T>,
    cls?: ClassConstructor<any>,
  ): Promise<T | null> {
    const result = await this.repository.findByPk(id, {
      ...options,
    });

    if (!result) {
      return null;
    }

    return this.toPlainInstance(result, cls);
  }

  /**
   * Search for a single instance by its UUID.
   * @param uuid UUID of the entity
   * @param options Additional Sequelize options such as includes, where, etc.
   * @param cls Optional class constructor for transforming the result
   */
  async findByUuid(
    uuid: string,
    options?: FindOptions<T>,
    cls?: ClassConstructor<any>,
  ): Promise<T | null> {
    const result = await this.repository.findOne({
      where: { uuid },
      ...options,
    });

    if (!result) {
      return null;
    }

    return this.toPlainInstance(result, cls);
  }

  /**
   * Search for a single instance. Returns the first instance found, or null if none can be found.
   * @param options Fields to be filtered
   */
  async findOne(
    options?: FindOptions<T>,
    cls?: ClassConstructor<any>,
  ): Promise<T | null> {
    const data = await this.repository.findOne(options);
    return this.toPlainInstance(data, cls);
  }

  /**
   * Find elements paginated
   */
  find(options?: FindOptions<T>, cls?: ClassConstructor<any>): Promise<T[]> {
    return this.repository
      .findAll(options)
      .then((r) => this.toPlainInstance(r, cls));
  }

  /**
   * Handle paginate methods interface
   */
  private async handlePagination(
    pageOptions: PageOptionsDto,
    criteria: WhereOptions<T>,
    order?: string[],
    cls?: Type,
    include?: Includeable | Includeable[],
    options?: CriteriaOptions<T>,
  ): Promise<PageDto<T>> {
    const results = await this.repository.findAndCountAll({
      where: criteria,
      include: include,
      order: order,
      limit: pageOptions.limit,
      offset: pageOptions.offset,
      attributes: options.attributes,
      subQuery: options.subquery,
      distinct: options.distinct,
    });
    const data = this.toPlainInstance(results.rows, cls);
    const count = results.count;
    return new PageDto(data, new PageMetaDto({ pageOptions, count }));
  }
  /**
   * Find all the rows matching your query, within a specified offset / limit, and get the total number of
   * rows matching your query. This is very useful for paging
   *
   * ```js
   * Model.findAndCountAll({
   *   where: ...,
   *   limit: 12,
   *   offset: 12
   * }).then(result => {
   *   ...
   * })
   * ```
   */
  findWithPagination(
    pageOptions: PageOptionsDto,
    criteria: WhereOptions<T>,
    order?: string[],
    cls?: Type<any>,
  ): Promise<PageDto<T>>;

  /**
   * Find all the rows matching your query, within a specified offset / limit, and get the total number of
   * rows matching your query. This is very useful for paging
   *
   * ```js
   * Model.findAndCountAll({
   *   where: ...,
   *   limit: 12,
   *   offset: 12
   * }).then(result => {
   *   ...
   * })
   * ```
   * In the above example, `result.rows` will contain rows 13 through 24, while `result.count` will return
   * the
   * total number of rows that matched your query.
   *
   * When you add includes, only those which are required (either because they have a where clause, or
   * because
   * `required` is explicitly set to true on the include) will be added to the count part.
   *
   * Suppose you want to find all users who have a profile attached:
   * ```js
   * User.findAndCountAll({
   *   include: [
   *      { model: Profile, required: true}
   *   ],
   *   limit: 3
   * });
   * ```
   * Because the include for `Profile` has `required` set it will result in an inner join, and only the users
   * who have a profile will be counted. If we remove `required` from the include, both users with and
   * without
   * profiles will be counted
   *
   * This function also support grouping, when `group` is provided, the count will be an array of objects
   * containing the count for each group and the projected attributes.
   * ```js
   * User.findAndCountAll({
   *   group: 'type'
   * });
   * ```
   */
  findWithPagination(options: CriteriaOptions<T>): Promise<PageDto<T>>;

  findWithPagination(
    options: unknown,
    criteria?: unknown | WhereOptions<T>,
    order?: unknown,
    cls?: unknown,
  ): Promise<PageDto<T>> {
    try {
      if (options instanceof PageOptionsDto) {
        return this.handlePagination(
          options,
          criteria as WhereOptions<T>,
          order as string[],
          cls as Type,
        );
      } else {
        const ops = options as CriteriaOptions<T>;
        return this.handlePagination(
          ops.pageOptions,
          ops.criteria,
          ops.order as string[],
          ops.cls,
          ops.include as Includeable,
          ops,
        );
      }
    } catch (error) {
      throw new Error(
        `Error trying to filter that model ${this.constructorName}: ${error.message}`,
      );
    }
  }

  /**
   * Search for multiple instances group by fields
   *
   * __Simple search using AND and =__
   * ```js
   * Model.findAll({
   *   where: {
   *     attr1: 42,
   *     attr2: 'cake'
   *   }
   *   group: ['field']
   * })
   * ```
   */
  async findGroupBy(
    criteria: WhereOptions<T>,
    group: GroupOption,
    order?: string[],
    include?: Includeable | Includeable[],
  ): Promise<BaseModel[]> {
    try {
      const results = await this.repository.findAll({
        where: criteria,
        group: group,
        include: include,
        order: order,
      });
      return results;
    } catch (error) {
      throw new Error(
        `Error trying to group model ${this.constructorName}: ${error.message}`,
      );
    }
  }

  /**
   * Execute a query on the DB, optionally bypassing all the Sequelize goodness.
   *
   * By default, the function will return two arguments: an array of results, and a metadata object,
   * containing number of affected rows etc. Use `const [results, meta] = await ...` to access the results.
   *
   * If you are running a type of query where you don't need the metadata, for example a `SELECT` query, you
   * can pass in a query type to make sequelize format the results:
   *
   * ```js
   * const [results, metadata] = await sequelize.query('SELECT...'); // Raw query - use array destructuring
   *
   * const results = await sequelize.query('SELECT...', { type: sequelize.QueryTypes.SELECT }); // SELECT query - no destructuring
   * ```
   *
   * @param sql
   * @param options Query options
   */
  executeQuery(
    sql: string | { query: string; values: unknown[] },
    options?: QueryOptions | QueryOptionsWithType<QueryTypes.RAW>,
  ) {
    /**
     * Equivalent
     *
     * const sqlz = new Sequelize(
     *   process.env.DB_NAME,
     *   process.env.DB_USER,
     *   process.env.DB_PASSWORD,
     *   {
     *     host: process.env.DB_HOST,
     *     dialect: 'postgres',
     *     define: {
     *       underscored: true,
     *     },
     *   },
     * );
     **/
    return this.repository.sequelize.query(sql, options);
  }

  protected toPlainInstance(result: any, classConstructor?: Type) {
    const clzc = classConstructor || this.cls;
    if (!clzc) return result;
    //plainToClass was deprecated
    return plainToInstance(clzc, result, {
      excludeExtraneousValues: true,
    });
  }

  async delete(criteria: WhereOptions<T>) {
    try {
      await this.repository.destroy({
        force: true,
        where: criteria,
      });
    } catch (error) {
      throw new Error(
        `Error trying to delete that model ${this.constructorName}: ${error.message}`,
      );
    }
  }
}
