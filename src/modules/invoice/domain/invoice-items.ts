import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object.interface";

type InvoiceItemProps = {
  id?: Id;
  name: string;
  price: number;
  invoiceId: Id;
};

export default class InvoiceItem extends BaseEntity implements AggregateRoot {
  private _name: string;
  private _price: number;
  private _invoiceId: Id;

  constructor(props: InvoiceItemProps) {
    super(props.id);
    this._name = props.name;
    this._price = props.price;
    this._invoiceId = props.invoiceId;
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }

  get invoiceId(): Id {
    return this._invoiceId;
  }
}
