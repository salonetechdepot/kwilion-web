import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  DataType,
  AllowNull,
  Index,
  Unique,
} from "sequelize-typescript";
import { UUIDV4 } from "sequelize";
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

@Table({
  tableName: "interviewers",
  timestamps: false,
  underscored: true,
})
export default class Interviewer extends Model<
  InferAttributes<Interviewer>,
  InferCreationAttributes<Interviewer>
> {
  @PrimaryKey
  @Default(UUIDV4)
  @Column(DataType.UUID)
  declare id: CreationOptional<string>;

  @Unique
  @Column({ type: DataType.STRING, allowNull: false, field: "interviewer_id" })
  declare interviewerId: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare name: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare email: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare phone: string | null;

  @Default(true)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  declare active: boolean;

  @Default("interviewer")
  @Column({ type: DataType.TEXT, allowNull: false })
  declare role: string;

  // Optional: if you later want interviewer-portal password separate from User.passwordHash
  @Column({ type: DataType.TEXT, allowNull: true })
  declare password: string | null;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, allowNull: false, field: "created_at" })
  declare createdAt: CreationOptional<Date>;
}
