import { Sequelize } from "sequelize-typescript";
import ProductModel from "./product.model";
import ProductRepository from "./product.repository";

describe("ProductRepository test", () => {
  let sequelize: Sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should find all products", async () => {
    await ProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Description 1",
      salesPrice: 10,
    });

    await ProductModel.create({
      id: "2",
      name: "Product 2",
      description: "Description 2",
      salesPrice: 20,
    });

    const productRepository = new ProductRepository();
    const products = await productRepository.findAll();

    expect(products).toHaveLength(2);
    expect(products[0].id.id).toBe("1");
    expect(products[0].name).toBe("Product 1");

    expect(products[1].id.id).toBe("2");
    expect(products[1].name).toBe("Product 2");
  });
});
