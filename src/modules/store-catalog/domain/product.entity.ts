import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";

type ProductProps = {
  id: string;
  name: string;
  description: string;
  salesPrice: number;
};

export default class Product extends BaseEntity implements AggregateRoot {
  private _name: string;
  private _description: string;
  private _salesPrice: number;

  constructor({ id, description, name, salesPrice }: ProductProps) {
    super();
    this._name = name;
    this._description = description;
    this._salesPrice = salesPrice;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  get salesPrice() {
    return this._salesPrice;
  }
}
