import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "./product.model";
import Product from "../domain/product.entity";
import Id from "../../@shared/domain/value-object/id.value-object.interface";
import ProductRepository from "./product.repository";

describe("ProductRepository test", () => {
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
    const product = new Product({
      id: new Id("1"),
      name: "Product 1",
      description: "Description 1",
      purchasePrice: 100,
      stock: 10,
    });

    const productRepository = new ProductRepository();
    await productRepository.add(product);

    const productDb = await ProductModel.findOne({
      where: { id: product.id.id },
    });

    expect(productDb.id).toBeDefined();
    expect(productDb.name).toBe("Product 1");
    expect(productDb.description).toBe("Description 1");
    expect(productDb.purchasePrice).toBe(100);
    expect(productDb.stock).toBe(10);
    expect(productDb.createdAt).toBeDefined();
    expect(productDb.updatedAt).toBeDefined();
  });
});
