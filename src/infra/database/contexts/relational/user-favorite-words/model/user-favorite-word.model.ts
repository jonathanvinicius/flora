import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { UserModel } from '../../users/model/user.model';
import { BaseModel } from '../../base';
import { WordModel } from '../../words/model/word.model';

@Table({
  tableName: 'user_favorite_words',
  underscored: true,
})
export class UserFavoriteWordModel extends BaseModel {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'id',
  })
  id: string;

  @Column({ type: DataType.DATE, allowNull: true, field: 'created_at' })
  added: Date;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => UserModel)
  user: UserModel;

  @ForeignKey(() => WordModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  wordId: number;

  @BelongsTo(() => WordModel)
  word: WordModel;
}
