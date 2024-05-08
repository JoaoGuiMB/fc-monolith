import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object.interface";
import Invoice from "../../domain/invoice";
import InvoiceItem from "../../domain/invoice-items";
import InvoiceGateway from "../../gateway/invoice.gateway";
import {
  GenerateInvoiceUseCaseInputDto,
  GenerateInvoiceUseCaseOutputDto,
} from "./generate.dto";

export default class GenerateInvoiceUseCase {
  private _invoiceRepository: InvoiceGateway;

  constructor(invoiceRepository: InvoiceGateway) {
    this._invoiceRepository = invoiceRepository;
  }

  async execute(
    input: GenerateInvoiceUseCaseInputDto
  ): Promise<GenerateInvoiceUseCaseOutputDto> {
    const address = new Address(
      input.street,
      input.number,
      input.zipCode,
      input.city,
      input.complement,
      input.state
    );

    const invoice = new Invoice({
      name: input.name,
      document: input.document,
      address,
      items: input.items.map((item) => {
        return new InvoiceItem({
          id: new Id(item.id),
          name: item.name,
          price: item.price,
        });
      }),
    });

    await this._invoiceRepository.add(invoice);

    return {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      total: invoice.total(),
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipCode,
      items: invoice.items.map((item) => {
        return {
          id: item.id.id,
          name: item.name,
          price: item.price,
          invoiceId: invoice.id.id,
          createdAt: item.createdAt,
        };
      }),
    };
  }
}
