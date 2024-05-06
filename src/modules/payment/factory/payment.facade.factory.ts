import PaymentFacade from "../facade/payment.facade";
import TransactionRepository from "../repository/transaction.repository";
import ProcessPaymentUseCase from "../usecase/process-payment/process-payment.usecase.dto";

export default class PaymentFacadeFactory {
  static create() {
    return new PaymentFacade(
      new ProcessPaymentUseCase(new TransactionRepository())
    );
  }
}
