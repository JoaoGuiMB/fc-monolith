import { Sequelize } from "sequelize-typescript";
import InvoiceItem from "../domain/invoice-items";
import InvoiceItemModel from "./invoice_item.model";
import InvoiceModel from "./invoice.model";
import Id from "../../@shared/domain/value-object/id.value-object.interface";
import Invoice from "../domain/invoice";
import Address from "../../@shared/domain/value-object/address.value-object";
import InvoiceRepository from "./invoice_repository";

describe("InvoiceRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create an invoice", async () => {
    const invoiceItemsRepository = new InvoiceRepository();
    const address = new Address(
      "Rua 1",
      10,
      "123456",
      "São Paulo",
      "Casa",
      "SP"
    );
    const invoiceItems = new InvoiceItem({
      id: new Id("1"),
      name: "Item 1",
      price: 100,
      invoiceId: new Id("1"),
    });

    const invoice = new Invoice({
      id: new Id("1"),
      name: "Invoice 1",
      document: "123456",
      address,
      items: [invoiceItems],
    });

    await invoiceItemsRepository.add(invoice);

    const invoiceModel = await InvoiceModel.findByPk("1", {
      include: [InvoiceItemModel],
    });

    expect(invoiceModel.id).toBe("1");
    expect(invoiceModel.items).toHaveLength(1);
    expect(invoiceModel.items[0].id).toBe("1");
  });

  it("should find a invoice item", async () => {
    const invoiceRepository = new InvoiceRepository();

    await InvoiceModel.create({
      id: "1",
      name: "Invoice 1",
      document: "123456",
      street: "Rua 1",
      number: 10,
      complement: "Casa",
      city: "São Paulo",
      state: "SP",
      zipCode: "123456",
      createdAt: new Date(),
      total: 100,
    });

    await InvoiceItemModel.create({
      id: "1",
      name: "Item 1",
      price: 100,
      invoiceId: "1",
      createdAt: new Date(),
    });

    const invoice = await invoiceRepository.find("1");

    expect(invoice).toBeInstanceOf(Invoice);
    expect(invoice.id).toEqual(new Id("1"));
    expect(invoice.name).toBe("Invoice 1");
    expect(invoice.items.length).toBe(1);
    expect(invoice.items[0].id).toEqual(new Id("1"));
    expect(invoice.items[0].name).toBe("Item 1");
  });
});
