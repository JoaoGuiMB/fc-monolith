import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../repository/product.model";
import ProductRepository from "../repository/product.repository";
import AddProductUseCase from "../usecase/add-product/add-product.usecase";
import ProductAdmFacade from "./product-adm.facade";

describe("ProductAdmFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should add a product", async () => {
    const productRepository = new ProductRepository();

    const addProductUseCase = new AddProductUseCase(productRepository);
    const productAdmFacade = new ProductAdmFacade({
      addUseCase: addProductUseCase,
      stockUseCase: undefined,
    });

    const input = {
      id: "1",
      name: "Product 1",
      description: "Description 1",
      purchasePrice: 100,
      stock: 10,
    };

    await productAdmFacade.addProduct(input);

    const product = await ProductModel.findOne({
      where: { id: input.id },
    });

    expect(product.id).toBe(product.id);
    expect(product.name).toBe("Product 1");
    expect(product.description).toBe("Description 1");
    expect(product.purchasePrice).toBe(100);
    expect(product.stock).toBe(10);
  });
});
