import { IBaseRepository } from '../../../infra/database/contexts/relational/interfaces/ibase-repository';
export const IWORD_REPOSITORY = 'IWordRepository';
export interface IWordRepository extends IBaseRepository<any> {}
