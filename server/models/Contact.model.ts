import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
} from "sequelize-typescript";
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

@Table({ tableName: "contacts", timestamps: false, underscored: true })
export class Contact extends Model<
  InferAttributes<Contact>,
  InferCreationAttributes<Contact>
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;

  @Column({ type: DataType.TEXT, allowNull: false }) declare name: string;
  @Column({ type: DataType.TEXT, allowNull: false }) declare company: string;
  @Column({ type: DataType.TEXT, allowNull: false }) declare email: string;
  @Column({ type: DataType.TEXT, allowNull: false }) declare phone: string;
  @Column({ type: DataType.TEXT, allowNull: false }) declare service: string;
  @Column({ type: DataType.TEXT, allowNull: false }) declare budget: string;
  @Column({ type: DataType.TEXT, allowNull: false }) declare message: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: "created_at",
    defaultValue: DataType.NOW,
  })
  declare createdAt: CreationOptional<Date>;
}

export default Contact;
