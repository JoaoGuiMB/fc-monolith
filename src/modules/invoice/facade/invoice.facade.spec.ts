import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/invoice.model";
import InvoiceItemModel from "../repository/invoice_item.model";
import InvoiceRepository from "../repository/invoice_repository";
import GenerateInvoiceUseCase from "../usecase/generate/generate.usecase";
import {
  FindInvoiceFacadeInputDTO,
  FindInvoiceFacadeOutputDTO,
  GenerateInvoiceFacadeInputDto,
  GenerateInvoiceFacadeOutputDto,
} from "./invoice.facade.interface";
import e from "express";
import InvoiceFacade from "./invoice.facade";
import InvoiceFacadeFactory from "../factory/facade.factory";

describe("InvoiceFacade test", () => {
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

  it("should generate an invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

    const input: GenerateInvoiceFacadeInputDto = {
      name: "John Doe",
      city: "New York",
      state: "NY",
      complement: "Apt 123",
      document: "123456789",
      number: 123,
      street: "Wall Street",
      zipCode: "12345",
      items: [
        { id: "1", price: 1, name: "Product 1" },
        { id: "2", price: 2, name: "Product 2" },
      ],
    };

    const invoice: GenerateInvoiceFacadeOutputDto = await facade.generate(
      input
    );
    expect(invoice.id).toBe(invoice.id);
    expect(invoice.name).toBe("John Doe");
    expect(invoice.city).toBe("New York");
    expect(invoice.state).toBe("NY");
    expect(invoice.complement).toBe("Apt 123");
    expect(invoice.street).toBe("Wall Street");
    expect(invoice.zipCode).toBe("12345");
    expect(invoice.items.length).toBe(2);
    expect(invoice.items[0].id).toBe("1");
    expect(invoice.items[0].price).toBe(1);
    expect(invoice.items[0].name).toBe("Product 1");
    expect(invoice.items[1].id).toBe("2");
    expect(invoice.items[1].price).toBe(2);
    expect(invoice.items[1].name).toBe("Product 2");
    expect(invoice.total).toBe(3);
  });

  it("should find an invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

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

    const findInput: FindInvoiceFacadeInputDTO = {
      id: "1",
    };

    const foundInvoice: FindInvoiceFacadeOutputDTO = await facade.find(
      findInput
    );

    expect(foundInvoice.id).toBe("1");
    expect(foundInvoice.name).toBe("Invoice 1");
    expect(foundInvoice.document).toBe("123456");
    expect(foundInvoice.address.street).toBe("Rua 1");
    expect(foundInvoice.address.number).toBe(10);
    expect(foundInvoice.address.complement).toBe("Casa");
    expect(foundInvoice.address.city).toBe("São Paulo");
    expect(foundInvoice.address.state).toBe("SP");
    expect(foundInvoice.address.zipCode).toBe("123456");
    expect(foundInvoice.items.length).toBe(1);
    expect(foundInvoice.items[0].id).toBe("1");
    expect(foundInvoice.items[0].name).toBe("Item 1");
    expect(foundInvoice.items[0].price).toBe(100);
    expect(foundInvoice.total).toBe(100);
  });
});
