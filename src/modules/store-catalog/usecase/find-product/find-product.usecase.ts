import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ProductRepository from "../../repository/product.repository";

export default class FindProduct implements UseCaseInterface {
  constructor(private readonly _productRepository: ProductRepository) {}

  async execute(id: string) {
    const product = await this._productRepository.find(id);

    return {
      id: product.id.id,
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    };
  }
}
