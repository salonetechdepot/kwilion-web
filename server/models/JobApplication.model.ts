import {
  Table,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  Index,
} from "sequelize-typescript";
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import JobPosting from "./JobPosting.model";

export type JobApplicationStatus =
  | "submitted"
  | "under_review"
  | "shortlisted"
  | "interview"
  | "rejected"
  | "hired"
  | "withdrawn";

@Table({
  tableName: "job_applications",
  timestamps: true,
  underscored: true,
  indexes: [
    { name: "job_applications_job_posting_id", fields: ["job_posting_id"] },
    { name: "job_applications_position_key", fields: ["position_key"] },
    { name: "job_applications_email", fields: ["email"] },
    { name: "job_applications_status", fields: ["status"] },
  ],
})
export default class JobApplication extends Model<
  InferAttributes<JobApplication>,
  InferCreationAttributes<JobApplication>
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: CreationOptional<string>;

  @Index
  @ForeignKey(() => JobPosting)
  @Column({ type: DataType.UUID, allowNull: true, field: "job_posting_id" })
  declare jobPostingId: string | null;

  @BelongsTo(() => JobPosting, { foreignKey: "jobPostingId" })
  declare jobPosting?: JobPosting;

  @Column({ type: DataType.TEXT, allowNull: true, field: "position_key" })
  declare positionKey: string | null;

  @Column({ type: DataType.TEXT, allowNull: false, field: "first_name" })
  declare firstName: string;

  @Column({ type: DataType.TEXT, allowNull: true, field: "middle_name" })
  declare middleName: string | null;

  @Column({ type: DataType.TEXT, allowNull: false, field: "last_name" })
  declare lastName: string;

  @Column({ type: DataType.TEXT, allowNull: false, field: "gender" })
  declare gender: string;

  @Column({ type: DataType.DATEONLY, allowNull: false, field: "dob" })
  declare dob: string;

  @Column({ type: DataType.TEXT, allowNull: false, field: "email" })
  declare email: string;

  @Column({ type: DataType.TEXT, allowNull: false, field: "phone" })
  declare phone: string;

  @Column({ type: DataType.TEXT, allowNull: false, field: "address_line_1" })
  declare addressLine1: string;

  @Column({ type: DataType.TEXT, allowNull: false, field: "city" })
  declare city: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: "district_or_province",
  })
  declare districtOrProvince: string;

  @Column({ type: DataType.TEXT, allowNull: true, field: "country" })
  declare country: string | null;

  @Column({ type: DataType.TEXT, allowNull: true, field: "ref_first_name" })
  declare refFirstName: string | null;

  @Column({ type: DataType.TEXT, allowNull: true, field: "ref_last_name" })
  declare refLastName: string | null;

  @Column({ type: DataType.TEXT, allowNull: true, field: "ref_phone" })
  declare refPhone: string | null;

  @Column({ type: DataType.TEXT, allowNull: true, field: "ref_email" })
  declare refEmail: string | null;

  @Column({ type: DataType.TEXT, allowNull: true, field: "ref_address_line_1" })
  declare refAddressLine1: string | null;

  @Column({ type: DataType.TEXT, allowNull: true, field: "ref_city" })
  declare refCity: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: "ref_district_or_province",
  })
  declare refDistrictOrProvince: string | null;

  @Column({ type: DataType.TEXT, allowNull: true, field: "cover_letter" })
  declare coverLetter: string | null;

  @Column({ type: DataType.TEXT, allowNull: false, field: "experience" })
  declare experience: string;

  @Column({ type: DataType.TEXT, allowNull: false, field: "availability" })
  declare availability: string;

  @Default("submitted")
  @Column({
    type: DataType.ENUM(
      "submitted",
      "under_review",
      "shortlisted",
      "interview",
      "rejected",
      "hired",
      "withdrawn"
    ),
    allowNull: false,
    field: "status",
  })
  declare status: JobApplicationStatus;

  @Column({ type: DataType.DATE, allowNull: true, field: "reviewed_at" })
  declare reviewedAt: Date | null;

  @Column({ type: DataType.TEXT, allowNull: true, field: "reviewer_note" })
  declare reviewerNote: string | null;

  @Column({ type: DataType.JSONB, allowNull: true, field: "raw_data" })
  declare rawData: Record<string, any> | null;
}
