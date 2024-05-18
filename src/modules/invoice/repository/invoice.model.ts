import InvoiceItemModel from "./invoice_item.model";
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";

@Table({
  tableName: "invoices",
  timestamps: false,
})
export default class InvoiceModel extends Model {
  @PrimaryKey
  @Column
  declare id: string;

  @HasMany(() => InvoiceItemModel)
  declare items: Awaited<InvoiceItemModel[]>;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare document: string;

  @Column({ allowNull: false })
  declare total: number;

  @Column({ allowNull: false })
  createdAt?: Date;

  @Column({ allowNull: false })
  street: string;

  @Column({ allowNull: false })
  number: number;

  @Column({ allowNull: false })
  complement: string;

  @Column({ allowNull: false })
  city: string;

  @Column({ allowNull: false })
  state: string;

  @Column({ allowNull: false })
  zipCode: string;
}
