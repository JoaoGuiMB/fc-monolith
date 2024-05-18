import { ClientModel } from "./client.model";
import ProductModel from "./product.model";
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
  tableName: "orders",
  timestamps: false,
})
export default class OrderModel extends Model {
  @PrimaryKey
  @Column
  declare id: string;

  @ForeignKey(() => ClientModel)
  @Column({ allowNull: false })
  declare client_id: string;

  @BelongsTo(() => ClientModel)
  declare client: ClientModel;

  @HasMany(() => ProductModel)
  declare products: Awaited<ProductModel[]>;

  @Column({ allowNull: false })
  declare status: string;

  @Column({ allowNull: false })
  createdAt?: Date;

  @Column({ allowNull: false })
  updatedAt?: Date;
}
