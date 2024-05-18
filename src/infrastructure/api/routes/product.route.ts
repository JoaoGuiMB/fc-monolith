import express, { Request, Response } from "express";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";
import { AddProductInputDto } from "../../../modules/product-adm/usecase/add-product/add-product.dto";

export const productRoute = express.Router();

const productAdmFacadeFactoryInstance = ProductAdmFacadeFactory.create();
productRoute.post("/", async (req: Request, res: Response) => {
  try {
    const productDto: AddProductInputDto = {
      name: req.body.name,
      description: req.body.description,
      stock: req.body.stock,
      purchasePrice: req.body.purchasePrice,
    };
    const product = await productAdmFacadeFactoryInstance.addProduct(
      productDto
    );
    res.status(200).json(product);
  } catch (error) {
    res.status(500).send(error);
  }
});
