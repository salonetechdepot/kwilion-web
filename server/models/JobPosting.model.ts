import {
  Table,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Index,
} from "sequelize-typescript";
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

export type JobPostingStatus = "draft" | "published" | "closed";

@Table({
  tableName: "job_postings",
  timestamps: true,
  underscored: true,
  indexes: [
    { name: "job_postings_slug", unique: true, fields: ["slug"] },
    { name: "job_postings_status", fields: ["status"] },
  ],
})
export default class JobPosting extends Model<
  InferAttributes<JobPosting>,
  InferCreationAttributes<JobPosting>
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: CreationOptional<string>;

  @Index({ unique: true })
  @Column({ type: DataType.STRING(32), allowNull: false, field: "job_code" })
  declare jobCode: string;

  @Index
  @Column({ type: DataType.TEXT, allowNull: false })
  declare title: string;

  // stable identifier for URLs (/careers/[slug]) or internal position keys
  @Index({ unique: true })
  @Column({ type: DataType.TEXT, allowNull: false })
  declare slug: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare department: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare location: string | null;

  @Column({ type: DataType.TEXT, allowNull: true, field: "employment_type" })
  declare employmentType: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare requirements: string | null;

  @Default("draft")
  @Column({
    type: DataType.ENUM("draft", "published", "closed"),
    allowNull: false,
  })
  declare status: JobPostingStatus;

  @Column({ type: DataType.DATE, allowNull: true, field: "published_at" })
  declare publishedAt: Date | null;

  @Column({ type: DataType.DATE, allowNull: true, field: "closes_at" })
  declare closesAt: Date | null;
}
