import { GenerateInvoiceUseCaseInputDto } from "./generate.dto";
import GenerateInvoiceUsecase from "./generate.usecase";

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
  };
};

describe("GenerateInvoiceUsecase unit test", () => {
  it("should generate an invoice", async () => {
    const repository = MockRepository();
    const usecase = new GenerateInvoiceUsecase(repository);
    const input: GenerateInvoiceUseCaseInputDto = {
      name: "Invoice 1",
      document: "123456",
      street: "Rua 1",
      number: 10,
      complement: "Casa",
      city: "São Paulo",
      state: "SP",
      zipCode: "123456",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 100,
        },
      ],
    };

    const output = await usecase.execute(input);

    expect(repository.add).toHaveBeenCalled();
    expect(output.name).toBe("Invoice 1");
    expect(output.document).toBe("123456");
  });
});
