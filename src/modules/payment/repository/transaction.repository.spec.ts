import { Sequelize } from "sequelize-typescript";
import TransactionModel from "./transaction.model";
import Transaction from "../domain/transaction";
import Id from "../../@shared/domain/value-object/id.value-object.interface";
import TransactionRepository from "./transaction.repository";

describe("TransactionRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    sequelize.addModels([TransactionModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should save a transaction", async () => {
    const transaction = new Transaction({
      id: new Id("1"),
      amount: 100,
      orderId: "1",
    });
    transaction.approve();

    const repository = new TransactionRepository();
    const result = await repository.save(transaction);

    expect(result.id.id).toBe("1");
    expect(result.amount).toBe(100);
    expect(result.orderId).toBe("1");
    expect(result.status).toBe("approved");
    expect(result.orderId).toBe("1");
  });
});
