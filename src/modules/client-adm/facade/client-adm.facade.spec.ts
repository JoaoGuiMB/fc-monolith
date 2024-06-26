import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import ClientRepository from "../repository/client.repository";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import CliendAdmFacade from "./client-adm.facade";
import CliendAdmFacadeFactory from "../factory/client-adm.facade.factory";
import FindClientUseCase from "../usecase/find-client/find-client.usecase";

describe("ClientAdmFacade test", () => {
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

  it("should create a client", async () => {
    const repository = new ClientRepository();
    const addUseCase = new AddClientUseCase(repository);
    const facade = new CliendAdmFacade({ addUseCase, findUseCase: undefined });

    const input = {
      id: "1",
      name: "John Doe",
      email: "x@x.com",
      address: "1234 Main St",
    };
    await facade.add(input);

    const client = await ClientModel.findByPk("1");
    expect(client).not.toBeNull();
    expect(client?.name).toBe("John Doe");
  });

  it("should find a client", async () => {
    const facade = CliendAdmFacadeFactory.create();

    const input = {
      id: "1",
      name: "John Doe",
      email: "x@x.com",
      address: "1234 Main St",
    };

    await facade.add(input);

    const client = await facade.find({ id: "1" });
    expect(client).not.toBeNull();
    expect(client.id).toBe("1");
    expect(client.name).toBe("John Doe");
  });
});
