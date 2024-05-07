export default class Address {
  _street: string = "";
  _complement: string = "";
  _number: number = 0;
  _zipCode: string = "";
  _city: string = "";
  _state: string = "";

  constructor(
    street: string,
    number: number,
    zipCode: string,
    city: string,
    complement: string,
    state: string
  ) {
    this._street = street;
    this._number = number;
    this._zipCode = zipCode;
    this._city = city;
    this._complement = complement;
    this._state = state;

    this.validate();
  }

  get street(): string {
    return this._street;
  }

  get number(): number {
    return this._number;
  }

  get zipCode(): string {
    return this._zipCode;
  }

  get city(): string {
    return this._city;
  }

  get state(): string {
    return this._state;
  }

  get complement(): string {
    return this._complement;
  }

  validate() {
    if (this._street.length === 0) {
      throw new Error("Street is required");
    }
    if (this._number === 0) {
      throw new Error("Number is required");
    }
    if (this._zipCode.length === 0) {
      throw new Error("Zip is required");
    }
    if (this._city.length === 0) {
      throw new Error("City is required");
    }
  }

  toString() {
    return `${this._street}, ${this._number}, ${this._zipCode} ${this._city}`;
  }
}
