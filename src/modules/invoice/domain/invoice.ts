import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Address from "../../@shared/domain/value-object/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object.interface";
import InvoiceItems from "./invoice-items";

type InvoiceProps = {
  id?: Id;
  name: string;
  document: string;
  address: Address;
  items: InvoiceItems[];
};

export default class Invoice extends BaseEntity implements AggregateRoot {
  private _name: string;
  private _document: string;
  private _address: Address;
  private _items: InvoiceItems[];

  constructor(props: InvoiceProps) {
    super(props.id);
    this._name = props.name;
    this._document = props.document;
    this._address = props.address;
    this._items = props.items;
  }

  get name(): string {
    return this._name;
  }

  get document(): string {
    return this._document;
  }

  get address(): Address {
    return this._address;
  }

  get items(): InvoiceItems[] {
    return this._items;
  }

  addItem(item: InvoiceItems): void {
    this._items.push(item);
  }

  removeItem(item: InvoiceItems): void {
    this._items = this._items.filter((i) => i.id !== item.id);
  }

  total(): number {
    return this._items.reduce((acc, item) => acc + item.price, 0);
  }

  validate(): void {
    if (this._name.length === 0) {
      throw new Error("Name is required");
    }
    if (this._document.length === 0) {
      throw new Error("Document is required");
    }
    if (this._address === null) {
      throw new Error("Address is required");
    }
    if (this._items.length === 0) {
      throw new Error("Items are required");
    }
  }

  toString(): string {
    return `${this._name}, ${this._document}, ${this._address.toString()}`;
  }
}
