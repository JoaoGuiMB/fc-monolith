import Id from "../../../@shared/domain/value-object/id.value-object.interface";
import Product from "../../domain/product.entity";
import CheckStockUsecase from "./check-stock.usecase";

const product = new Product({
  id: new Id("1"),
  name: "Product 1",
  purchasePrice: 100,
  description: "Description",
  stock: 10,
});

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
  };
};

describe("CheckStockUsecase usecase unit test", () => {
  it("should return stock of a product", async () => {
    const ProductRepository = MockRepository();
    const checkStockUsecase = new CheckStockUsecase(ProductRepository);

    const input = { productId: "1" };
    const output = await checkStockUsecase.execute(input);

    expect(ProductRepository.find).toHaveBeenCalled();
    expect(output.productId).toBe("1");
    expect(output.stock).toBe(10);
  });
});
