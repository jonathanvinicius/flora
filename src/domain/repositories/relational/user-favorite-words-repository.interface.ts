import { IBaseRepository } from '../../../infra/database/contexts/relational/interfaces/ibase-repository';
export const IUSER_FAVORITE_WORDS_REPOSITORY = 'IUserFavoriteRepository';

export interface IUserFavoriteWordRepository extends IBaseRepository<any> {}
