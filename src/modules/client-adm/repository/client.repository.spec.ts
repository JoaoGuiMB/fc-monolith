import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "./client.model";
import ClientRepository from "./client.repository";

describe("ProductRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find a client", async () => {
    const client = await ClientModel.create({
      id: "1",
      name: "John Doe",
      email: "aasd@email.com",
      address: "1234 Main St",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const clientRepository = new ClientRepository();

    const result = await clientRepository.find("1");
    expect(result.id.id).toBe("1");
    expect(result.name).toBe("John Doe");
  });
});
