import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  DataType,
  Unique,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { UUIDV4 } from "sequelize";
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

@Table({ tableName: "users", timestamps: true, underscored: true })
export default class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @PrimaryKey
  @Default(UUIDV4)
  @Column(DataType.UUID)
  declare id: CreationOptional<string>;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Unique
  @Column({ type: DataType.STRING, allowNull: false })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: true, field: "avatar_url" })
  declare avatar: CreationOptional<string | null>;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  declare createdAt: CreationOptional<Date>;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: "updated_at" })
  declare updatedAt: CreationOptional<Date>;
}
