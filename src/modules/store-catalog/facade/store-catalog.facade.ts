import FindAllProductsUseCase from "../usecase/find-all-products/find.all-products.usecase";
import FindProduct from "../usecase/find-product/find-product.usecase";
import StoreCatalogFacadeInterface, {
  FindStoreCatalogFacadeInputDto,
} from "./store-catalog.facade.interface";

export interface UseCaseProps {
  findUsecase: FindProduct;
  findAllUsecase: FindAllProductsUseCase;
}

export default class StoreCatalogFacade implements StoreCatalogFacadeInterface {
  private _findUsecase: FindProduct;
  private _findAllUsecase: FindAllProductsUseCase;
  constructor(props: UseCaseProps) {
    this._findUsecase = props.findUsecase;
    this._findAllUsecase = props.findAllUsecase;
  }

  async find({ id }: FindStoreCatalogFacadeInputDto) {
    const product = await this._findUsecase.execute(id);
    return product;
  }

  async findAll() {
    return await this._findAllUsecase.execute();
  }
}
