import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for client", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a new client", async () => {
    const response = await request(app).post("/client").send({
      name: "Client 1",
      purchasePrice: 100,
      email: "a@email.com",
      address: "asdsd",
    });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Client 1");
    expect(response.body.email).toBe("a@email.com");
    expect(response.body.address).toBe("asdsd");
    expect(response.body.id).toBeDefined();
  });
});
