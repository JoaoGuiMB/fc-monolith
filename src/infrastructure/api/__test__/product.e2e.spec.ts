import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a new product", async () => {
    const response = await request(app).post("/product").send({
      name: "Product 1",
      purchasePrice: 100,
      description: "a",
      stock: 10,
    });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Product 1");
    expect(response.body.purchasePrice).toBe(100);
    expect(response.body.description).toBe("a");
    expect(response.body.stock).toBe(10);
    expect(response.body.id).toBeDefined();
  });
});
