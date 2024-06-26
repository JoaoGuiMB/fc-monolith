import Id from "../../../@shared/domain/value-object/id.value-object.interface";
import Transaction from "../../domain/transaction";
import ProcessPaymentUseCase from "./process-payment.usecase.dto";

const transaction = new Transaction({
  id: new Id("1"),
  amount: 100,
  orderId: "1",
  status: "approved",
});

const MockRepository = () => {
  return {
    save: jest.fn().mockReturnValue(Promise.resolve(transaction)),
  };
};

const transaction2 = new Transaction({
  id: new Id("1"),
  amount: 50,
  orderId: "1",
  status: "declined",
});

const MockRepositoryDeclined = () => {
  return {
    save: jest.fn().mockReturnValue(Promise.resolve(transaction2)),
  };
};

describe("ProcessPaymentUseCase", () => {
  it("should approve a transaction", async () => {
    const paymentRepository = MockRepository();
    const useCase = new ProcessPaymentUseCase(paymentRepository);

    const input = {
      orderId: "1",
      amount: 100,
    };

    const result = await useCase.execute(input);
    expect(paymentRepository.save).toBeCalledTimes(1);
    expect(result.status).toBe("approved");
    expect(result.transactionId).toBe(transaction.id.id);
    expect(result.orderId).toBe(transaction.orderId);
    expect(result.amount).toBe(transaction.amount);
    expect(result.createdAt).toBe(transaction.createdAt);
    expect(result.updatedAt).toBe(transaction.updatedAt);
  });

  it("should decline a transaction", async () => {
    const paymentRepository = MockRepositoryDeclined();
    const useCase = new ProcessPaymentUseCase(paymentRepository);

    const input = {
      orderId: "1",
      amount: 50,
    };

    const result = await useCase.execute(input);
    expect(paymentRepository.save).toBeCalledTimes(1);
    expect(result.status).toBe("declined");
    expect(result.transactionId).toBe(transaction2.id.id);
    expect(result.orderId).toBe(transaction2.orderId);
    expect(result.amount).toBe(transaction2.amount);
    expect(result.createdAt).toBe(transaction2.createdAt);
    expect(result.updatedAt).toBe(transaction2.updatedAt);
  });
});
