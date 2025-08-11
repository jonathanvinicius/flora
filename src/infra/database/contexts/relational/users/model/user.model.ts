import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base';
import { UserSearchHistoryModel } from '../../user-search-history/model/user-search-history.model';
import { UserFavoriteWordModel } from '../../user-favorite-words/model/user-favorite-word.model';
import { WordModel } from '../../words/model/word.model';

@Table({
  tableName: 'users',
  underscored: true,
})
export class UserModel extends BaseModel {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @HasMany(() => UserSearchHistoryModel)
  userSearchHistories: UserSearchHistoryModel[];

  @BelongsToMany(() => WordModel, () => UserFavoriteWordModel)
  favoriteWords: WordModel[];
}
