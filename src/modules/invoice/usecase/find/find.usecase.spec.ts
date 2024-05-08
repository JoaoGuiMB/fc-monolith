import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object.interface";
import Invoice from "../../domain/invoice";
import InvoiceItem from "../../domain/invoice-items";
import { FindInvoiceUseCaseOutputDTO } from "./find.dto";
import FindInvoiceUseCase from "./find.usecase";

const address = new Address("Rua 1", 10, "123456", "São Paulo", "Casa", "SP");

const invoiceItem = new InvoiceItem({
  id: new Id("1"),
  name: "Item 1",
  price: 100,
});

const invoice = new Invoice({
  id: new Id("1"),
  name: "Invoice 1",
  document: "123456",
  address,
  items: [invoiceItem],
});

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    add: jest.fn(),
  };
};

describe("FindInvoiceUsecase test", () => {
  it("should find a invoice", () => {
    const repository = MockRepository();
    const usecase = new FindInvoiceUseCase(repository);

    const input = {
      id: "1",
    };

    const result = usecase.execute(input);
    const output: FindInvoiceUseCaseOutputDTO = {
      id: "1",
      name: "Invoice 1",
      document: "123456",
      address: {
        street: "Rua 1",
        number: 10,
        complement: "Casa",
        city: "São Paulo",
        state: "SP",
        zipCode: "123456",
      },
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 100,
        },
      ],
      total: 100,
      createdAt: invoice.createdAt,
    };

    expect(repository.find).toBeCalledWith("1");
    expect(result).resolves.toEqual(output);
  });
});
