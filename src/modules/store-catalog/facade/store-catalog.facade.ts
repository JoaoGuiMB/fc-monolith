import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import StoreCatalogFacadeInterface, {
  FindStoreCatalogFacadeInputDto,
} from "./store-catalog.facade.interface";

export interface UseCaseProps {
  findUsecase: UseCaseInterface;
  findAllUsecase: UseCaseInterface;
}

export default class StoreCatalogFacade implements StoreCatalogFacadeInterface {
  private _findUsecase: UseCaseInterface;
  private _findAllUsecase: UseCaseInterface;

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
