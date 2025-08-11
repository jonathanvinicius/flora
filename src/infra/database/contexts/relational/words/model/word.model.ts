import { BelongsToMany, Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from '../../base';
import { UserModel } from '../../users/model/user.model';
import { UserFavoriteWordModel } from '../../user-favorite-words/model/user-favorite-word.model';

@Table({
  tableName: 'words',
  underscored: true,
})
export class WordModel extends BaseModel {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  phonetics: JSON;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  meanings: JSON;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
  })
  sourceUrls: string[];
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isCompleted: boolean;

  @BelongsToMany(() => UserModel, () => UserFavoriteWordModel)
  users: UserModel[];
}
