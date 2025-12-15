import {
  Table,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Index,
  ForeignKey,
} from "sequelize-typescript";
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

export type AttachmentKind =
  | "resume"
  | "cover_letter"
  | "id"
  | "certificate"
  | "other";

@Table({
  tableName: "job_application_attachments",
  timestamps: true,
  underscored: true,
  indexes: [
    { name: "job_app_attachments_application_id", fields: ["application_id"] },
    { name: "job_app_attachments_kind", fields: ["kind"] },
  ],
})
export default class JobApplicationAttachment extends Model<
  InferAttributes<JobApplicationAttachment>,
  InferCreationAttributes<JobApplicationAttachment>
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: CreationOptional<string>;

  @Index
  @ForeignKey(() => require("./JobApplication.model").default)
  @Column({ type: DataType.UUID, allowNull: false, field: "application_id" })
  declare applicationId: string;

  @Default("resume")
  @Column({
    type: DataType.ENUM("resume", "cover_letter", "id", "certificate", "other"),
    allowNull: false,
  })
  declare kind: AttachmentKind;

  @Column({ type: DataType.TEXT, allowNull: false, field: "original_name" })
  declare originalName: string;

  @Column({ type: DataType.TEXT, allowNull: false, field: "storage_url" })
  declare storageUrl: string;

  @Column({ type: DataType.TEXT, allowNull: true, field: "mime_type" })
  declare mimeType: string | null;

  @Column({ type: DataType.INTEGER, allowNull: true, field: "size_bytes" })
  declare sizeBytes: number | null;
}
