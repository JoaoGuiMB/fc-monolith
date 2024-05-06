import Id from "../../../@shared/domain/value-object/id.value-object.interface";
import Client from "../../domain/client-entity";
import FindClientUseCase from "./find-client.usecase";

const client = new Client({
  id: new Id("1"),
  name: "John Doe",
  email: "email@email.com",
  address: "1234 Main St",
});

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(client)),
  };
};

describe("Find client use case unit test", () => {
  it("Should find a client", async () => {
    const repository = MockRepository();
    const usecase = new FindClientUseCase(repository);

    const input = {
      id: "1",
    };

    const result = await usecase.execute(input);
    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toBe("1");
    expect(result.name).toBe("John Doe");
    expect(result.email).toBe("email@email.com");
  });
});
