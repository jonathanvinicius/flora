import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { UserModel } from '../../users/model/user.model';
import { BaseModel } from '../../base';

@Table({
  tableName: 'user_search_histories',
  underscored: true,
})
export class UserSearchHistoryModel extends BaseModel {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'id',
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  word: string;

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
}
