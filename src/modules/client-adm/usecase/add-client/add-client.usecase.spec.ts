import AddClientUseCase from "./add-client.usecase";

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
  };
};

describe("Add client use case unit test", () => {
  it("Should add a client", async () => {
    const repository = MockRepository();
    const usecase = new AddClientUseCase(repository);

    const input = {
      name: "John Doe",
      email: "x@casd.com",
      address: "123 Street",
    };

    const result = await usecase.execute(input);
    expect(repository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toBe("John Doe");
  });
});
