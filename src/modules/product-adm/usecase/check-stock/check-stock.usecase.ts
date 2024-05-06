import ProductGateway from "../../gateway/product.gateway";
import { CheckStockInputDto, CheckStockOutputDto } from "./check-stock.dto";

export default class CheckStockUsecase {
  private productRepository: ProductGateway;

  constructor(productRepository: ProductGateway) {
    this.productRepository = productRepository;
  }

  async execute({
    productId,
  }: CheckStockInputDto): Promise<CheckStockOutputDto> {
    const product = await this.productRepository.find(productId);
    return {
      productId: product.id.id,
      stock: product.stock,
    };
  }
}
