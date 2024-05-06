import PaymentGateway from "../domain/gateway/payment.gateway";
import Transaction from "../domain/transaction";
import TransactionModel from "./transaction.model";

export default class TransactionRepository implements PaymentGateway {
  async save(input: Transaction): Promise<Transaction> {
    await TransactionModel.create({
      id: input.id.id,
      orderId: input.orderId,
      amount: input.amount,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
      status: input.status,
    });

    return new Transaction({
      id: input.id,
      orderId: input.orderId,
      amount: input.amount,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
      status: input.status,
    });
  }
}
