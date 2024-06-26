import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../repository/product.model";
import ProductRepository from "../repository/product.repository";
import AddProductUseCase from "../usecase/add-product/add-product.usecase";
import ProductAdmFacade from "./product-adm.facade";
import ProductAdmFacadeFactory from "../factory/facade.factory";

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
    const productAdmFacade = ProductAdmFacadeFactory.create();

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

  it("should check product stock", async () => {
    const productAdmFacade = ProductAdmFacadeFactory.create();

    const input = {
      id: "1",
      name: "Product 1",
      description: "Description 1",
      purchasePrice: 100,
      stock: 10,
    };

    await productAdmFacade.addProduct(input);
    const result = await productAdmFacade.checkStock({ productId: "1" });

    expect(result.productId).toBe(input.id);
    expect(result.stock).toBe(10);
  });
});
