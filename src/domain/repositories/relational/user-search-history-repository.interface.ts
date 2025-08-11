import { IBaseRepository } from '../../../infra/database/contexts/relational/interfaces/ibase-repository';
export const IUSER_SEARCH_HISTORY_REPOSITORY = 'IUserSearchHistoryRepository';

export interface IUserSearchHistoryRepository extends IBaseRepository<any> {}
