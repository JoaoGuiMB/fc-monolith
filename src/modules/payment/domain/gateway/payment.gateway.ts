import Transaction from "../transaction";

export default interface PaymentGateway {
  save(input: Transaction): Promise<Transaction>;
}
