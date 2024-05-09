import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object.interface";
import Client from "./client.entity";
import Product from "./product.entity";

type OrderProps = {
  id?: Id;
  status?: string;
  client: Client;
  products: Product[];
};

export default class Order extends BaseEntity implements AggregateRoot {
  private _status: string;
  private _client: Client;
  private _products: Product[];

  constructor(props: OrderProps) {
    super(props.id);
    this._status = props.status || "pending";
    this._client = props.client;
    this._products = props.products;
  }

  get status() {
    return this._status;
  }

  get client() {
    return this._client;
  }

  get products() {
    return this._products;
  }

  addProduct(product: Product) {
    this._products.push(product);
  }

  removeProduct(productId: Id) {
    this._products = this._products.filter(
      (product) => product.id !== productId
    );
  }

  updateStatus(status: string) {
    this._status = status;
  }

  approved() {
    this.updateStatus("approved");
  }

  get total() {
    return this._products.reduce((acc, product) => acc + product.salesPrice, 0);
  }
}
