import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "./client.model";
import ClientRepository from "./client.repository";
import Client from "../domain/client-entity";
import Id from "../../@shared/domain/value-object/id.value-object.interface";

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
    await ClientModel.create({
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

  it("should create client", async () => {
    const clientRepository = new ClientRepository();
    const client = new Client({
      id: new Id("1"),
      name: "John Doe",
      email: "asd@email.com",
      address: "1234 Main St",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await clientRepository.add(client);

    const result = await ClientModel.findByPk("1");
    expect(result.id).toBe("1");
    expect(result.name).toBe("John Doe");
    expect(result.createdAt).toStrictEqual(client.createdAt);
  });
});
