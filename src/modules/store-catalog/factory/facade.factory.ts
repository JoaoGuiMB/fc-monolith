import StoreCatalogFacade from "../facade/store-catalog.facade";
import StoreCatalogFacadeInterface from "../facade/store-catalog.facade.interface";
import ProductRepository from "../repository/product.repository";
import FindAllProductsUseCase from "../usecase/find-all-products/find.all-products.usecase";
import FindProduct from "../usecase/find-product/find-product.usecase";

export default class StoreCatalogFacadeFactory {
  static create(): StoreCatalogFacade {
    const productRepository = new ProductRepository();
    const findAllUsecase = new FindAllProductsUseCase(productRepository);
    const findUsecase = new FindProduct(productRepository);
    const facade = new StoreCatalogFacade({
      findAllUsecase,
      findUsecase,
    });

    return facade;
  }
}
