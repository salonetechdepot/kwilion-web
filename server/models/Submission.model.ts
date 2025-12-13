// database/models/Submission.model.ts
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  DataType,
  BelongsTo,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
  Index,
} from "sequelize-typescript";
import { UUIDV4 } from "sequelize";
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import Interviewer from "./Interviewer.model";

@Table({
  tableName: "submissions",
  timestamps: true, // ✅ like User
  underscored: true, // ✅ DB columns in snake_case
})
export default class Submission extends Model<
  InferAttributes<Submission>,
  InferCreationAttributes<Submission>
> {
  @PrimaryKey
  @Default(UUIDV4)
  @Column(DataType.UUID)
  declare id: CreationOptional<string>;

  @ForeignKey(() => Interviewer)
  @Column({ type: DataType.STRING, allowNull: true, field: "interviewer_id" })
  declare interviewerId: string | null;

  @BelongsTo(() => Interviewer, {
    foreignKey: "interviewerId",
    targetKey: "interviewerId",
    as: "interviewer",
  })
  declare interviewer?: Interviewer;

  @Column({ type: DataType.STRING, allowNull: true, field: "interviewer_name" })
  declare interviewerName: string | null;

  @Column({ type: DataType.STRING, allowNull: true, field: "business_name" })
  declare businessName: string | null;

  @Column({ type: DataType.STRING, allowNull: true, field: "business_type" })
  declare businessType: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  declare district: string | null;

  @Column({ type: DataType.JSONB, allowNull: true, field: "response_data" })
  declare responseData: Record<string, unknown> | null;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, allowNull: false, field: "submission_date" })
  declare submissionDate: CreationOptional<Date>;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  declare createdAt: CreationOptional<Date>;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: "updated_at" })
  declare updatedAt: CreationOptional<Date>;
}
