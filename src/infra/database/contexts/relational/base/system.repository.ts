//  Equivalent

import { Injectable, Logger } from '@nestjs/common';
import {
  QueryOptions,
  QueryOptionsWithType,
  QueryTypes,
  Sequelize,
} from 'sequelize';

/**
 * System repository provider access to sequelize (ORM)
 * > Execute SQL statements directly
 */
@Injectable()
export class SystemRepository {
  private sqz: Sequelize;
  private logger = new Logger(SystemRepository.name);
  constructor() {}

  /**
   * Sequelize instance
   */
  get sequelize() {
    if (!this.sqz) {
      this.logger.log('Sequelize instance');
      this.sqz = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
          host: process.env.DB_HOST,
          dialect: 'postgres',
          define: {
            underscored: true,
          },
        },
      );
    }
    return this.sqz;
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
    this.logger.log('Executing query native');
    return this.sequelize.query(sql, { ...options, logging: false });
  }
}
