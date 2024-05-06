import { Sequelize } from "sequelize-typescript";
import TransactionModel from "../repository/transaction.model";
import TransactionRepository from "../repository/transaction.repository";
import ProcessPaymentUseCase from "../usecase/process-payment/process-payment.usecase.dto";
import PaymentFacade from "./payment.facade";
import PaymentFacadeFactory from "../factory/payment.facade.factory";

describe("PaymentFacade", () => {
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

  it("should create a transaction", async () => {
    // Arrange
    const transaction = {
      amount: 100,
      orderId: "1",
    };
    const paymentFacade = PaymentFacadeFactory.create();
    // Act
    const result = await paymentFacade.process(transaction);

    // Assert
    expect(result.transactionId).toBeDefined();
    expect(result.amount).toBe(100);
    expect(result.orderId).toBe("1");
    expect(result.status).toBe("approved");
  });
});
