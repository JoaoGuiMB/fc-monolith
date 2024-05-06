import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import PaymentGateway from "../../domain/gateway/payment.gateway";
import Transaction from "../../domain/transaction";
import {
  ProcessPaymentInputDto,
  ProcessPaymentOutputDto,
} from "./process-payment.dto";

export default class ProcessPaymentUseCase implements UseCaseInterface {
  private readonly transactionRepository: PaymentGateway;

  constructor(transactionRepository: PaymentGateway) {
    this.transactionRepository = transactionRepository;
  }

  async execute(
    input: ProcessPaymentInputDto
  ): Promise<ProcessPaymentOutputDto> {
    const transaction = new Transaction({
      amount: input.amount,
      orderId: input.orderId,
    });

    transaction.process();

    const persistTransaction = await this.transactionRepository.save(
      transaction
    );

    return {
      transactionId: persistTransaction.id.id,
      orderId: persistTransaction.orderId,
      amount: persistTransaction.amount,
      createdAt: persistTransaction.createdAt,
      updatedAt: persistTransaction.updatedAt,
      status: persistTransaction.status,
    };
  }
}
