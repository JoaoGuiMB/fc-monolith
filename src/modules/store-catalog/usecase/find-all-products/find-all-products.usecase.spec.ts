import Id from "../../../@shared/domain/value-object/id.value-object.interface";
import Product from "../../domain/product.entity";
import FindAllProductsUseCase from "./find.all-products.usecase";

const product = new Product({
  id: new Id("1"),
  description: "description",
  name: "name",
  salesPrice: 1,
});

const product2 = new Product({
  id: new Id("2"),
  description: "description",
  name: "name",
  salesPrice: 2,
});

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    findAll: jest.fn().mockReturnValue(Promise.resolve([product, product2])),
  };
};

describe("FindAllProductsUsecase unit test", () => {
  it("should return all products", async () => {
    const repository = MockRepository();
    const usecase = new FindAllProductsUseCase(repository);
    const result = await usecase.execute();

    expect(repository.findAll).toHaveBeenCalled();
    expect(result.products).toHaveLength(2);
    expect(result.products[0].id).toBe(product.id.id);
    expect(result.products[0].name).toBe(product.name);

    expect(result.products[1].id).toBe(product2.id.id);
    expect(result.products[1].name).toBe(product2.name);
  });
});
