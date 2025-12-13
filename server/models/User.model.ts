// ...existing imports...
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Unique,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { UUIDV4 } from "sequelize";
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import Interviewer from "./Interviewer.model";

@Table({ tableName: "users", timestamps: true, underscored: true })
export default class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @PrimaryKey
  @Default(UUIDV4)
  @Column(DataType.UUID)
  declare id: CreationOptional<string>;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare name: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  declare email: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare phone: CreationOptional<string | null>;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "password_hash" })
  declare passwordHash: string;

  @AllowNull(false)
  @Default("user")
  @Column(
    DataType.ENUM(
      "system_admin",
      "admin",
      "supervisor",
      "data_analyst",
      "interviewer",
      "user"
    )
  )
  declare role:
    | "system_admin"
    | "admin"
    | "supervisor"
    | "data_analyst"
    | "interviewer"
    | "user";

  @AllowNull(false)
  @Default(true)
  @Column({ type: DataType.BOOLEAN, field: "is_active" })
  declare isActive: boolean;

  @Column({ type: DataType.STRING, allowNull: true, field: "avatar_url" })
  declare avatar: CreationOptional<string | null>;

  // NEW: FK to Interviewer.interviewerId (text key)
  @ForeignKey(() => Interviewer)
  @Column({ type: DataType.STRING, allowNull: true, field: "interviewer_id" })
  declare interviewerId: string | null;

  @BelongsTo(() => Interviewer, {
    foreignKey: "interviewerId",
    targetKey: "interviewerId",
  })
  declare interviewer?: Interviewer;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  declare createdAt: CreationOptional<Date>;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: "updated_at" })
  declare updatedAt: CreationOptional<Date>;
}
