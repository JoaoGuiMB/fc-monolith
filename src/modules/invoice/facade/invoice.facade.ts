import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, {
  FindInvoiceFacadeInputDTO,
  GenerateInvoiceFacadeInputDto,
  GenerateInvoiceFacadeOutputDto,
} from "./invoice.facade.interface";

export interface UseCasesProps {
  find: UseCaseInterface;
  generate: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
  private findInvoiceUseCase: UseCaseInterface;
  private generateInvoiceUseCase: UseCaseInterface;

  constructor(props: UseCasesProps) {
    this.findInvoiceUseCase = props.find;
    this.generateInvoiceUseCase = props.generate;
  }

  async generate(
    invoice: GenerateInvoiceFacadeInputDto
  ): Promise<GenerateInvoiceFacadeOutputDto> {
    return await this.generateInvoiceUseCase.execute(invoice);
  }

  async find(id: FindInvoiceFacadeInputDTO) {
    return await this.findInvoiceUseCase.execute(id);
  }
}
