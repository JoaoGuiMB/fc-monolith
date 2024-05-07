import Address from "../../@shared/domain/value-object/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object.interface";
import Invoice from "../domain/invoice";
import InvoiceItem from "../domain/invoice-items";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceModel from "./invoice.model";
import InvoiceItemModel from "./invoice_item.model";

export default class InvoiceRepository implements InvoiceGateway {
  async add(invoice: Invoice): Promise<void> {
    await InvoiceModel.create(
      {
        id: invoice.id.id,
        name: invoice.name,
        document: invoice.document,
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        total: invoice.total(),
        zipCode: invoice.address.zipCode,
        createdAt: new Date(),
        items: invoice.items.map((item) => {
          return {
            id: item.id.id,
            name: item.name,
            price: item.price,
            invoiceId: invoice.id.id,
            createdAt: new Date(),
          };
        }),
      },
      {
        include: [
          {
            model: InvoiceItemModel,
            as: "items",
          },
        ],
      }
    );
  }

  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({
      where: { id },
      include: ["items"],
      rejectOnEmpty: true,
    });

    if (!invoice) {
      throw new Error(`Invoice with id ${id} not found`);
    }
    const address = new Address(
      invoice.street,
      invoice.number,
      invoice.zipCode,
      invoice.city,
      invoice.complement,
      invoice.state
    );

    const items = invoice.items.map((item) => {
      return new InvoiceItem({
        ...item,
        id: new Id(item.id),
        invoiceId: new Id(item.invoiceId),
      });
    });

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      address,
      items,
    });
  }
}
