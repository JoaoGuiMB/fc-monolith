import Id from "../../../@shared/domain/value-object/id.value-object.interface";
import Product from "../../domain/product.entity";
import FindProductUsecase from "./find-product.usecase";

const product = new Product({
  id: new Id("1"),
  name: "Product 1",
  description: "Description 1",
  salesPrice: 100,
});

const MockRepository = () => {
  return {
    findAll: jest.fn().mockResolvedValue([product]),
    find: jest.fn().mockResolvedValue(product),
  };
};

describe("Find product usecase unit  test", () => {
  it("should find a product", async () => {
    const repository = MockRepository();
    const usecase = new FindProductUsecase(repository);
    const product = await usecase.execute("1");

    expect(repository.find).toBeCalledWith("1");
    expect(product.id.id).toBe("1");
    expect(product.name).toBe("Product 1");
  });
});
