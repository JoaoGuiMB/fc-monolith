import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import ProductAdmFacadeInterface, {
  AddProductFacadeInputDto,
  CheckStockFacadeInputDto,
  CheckStockFacadeOutputDto,
} from "./product-adm.facade.interface";

export interface UseCasesProps {
  addUseCase: UseCaseInterface;
  stockUseCase: UseCaseInterface;
}

export default class ProductAdmFacade implements ProductAdmFacadeInterface {
  private _addUseCase: UseCaseInterface;
  private _checkStockUseCase: UseCaseInterface;

  constructor(useCaseProps: UseCasesProps) {
    this._addUseCase = useCaseProps.addUseCase;
    this._checkStockUseCase = useCaseProps.stockUseCase;
  }

  async addProduct(product: AddProductFacadeInputDto): Promise<void> {
    // caso o dto do caso de uso seja diferente do dto da facade, é necessário fazer a conversão
    return this._addUseCase.execute(product);
  }

  async checkStock(
    id: CheckStockFacadeInputDto
  ): Promise<CheckStockFacadeOutputDto> {
    return this._checkStockUseCase.execute(id);
  }
}
