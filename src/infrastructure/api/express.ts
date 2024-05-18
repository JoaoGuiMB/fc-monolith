import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { productRoute } from "./routes/product.route";
import { ProductModel } from "../../modules/product-adm/repository/product.model";

export const app: Express = express();

app.use(express.json());
app.use("/product", productRoute);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
  await sequelize.addModels([ProductModel]);
  await sequelize.sync();
}

setupDb();
