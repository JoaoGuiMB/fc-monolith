import InvoiceFacade from "../facade/invoice.facade";
import InvoiceRepository from "../repository/invoice_repository";
import FindInvoiceUseCase from "../usecase/find/find.usecase";
import GenerateInvoiceUseCase from "../usecase/generate/generate.usecase";

export default class InvoiceFacadeFactory {
  static create() {
    const invoiceRepository = new InvoiceRepository();
    const generate = new GenerateInvoiceUseCase(invoiceRepository);
    const find = new FindInvoiceUseCase(invoiceRepository);

    const invoiceFacade = new InvoiceFacade({
      generate,
      find,
    });

    return invoiceFacade;
  }
}
