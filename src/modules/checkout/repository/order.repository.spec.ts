import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object.interface";
import Address from "../../@shared/domain/value-object/address.value-object";

import OrderModel from "./order.model";
import { ClientModel } from "./client.model";
import ProductModel from "./product.model";
import CheckoutRepository from "./order.repository";
import Client from "../domain/client.entity";
import Product from "../domain/product.entity";
import Order from "../domain/order.entity";

describe("OrderRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([OrderModel, ProductModel, ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create an order", async () => {
    const checkoutRepository = new CheckoutRepository();

    const client = new Client({
      id: new Id("c1"),
      address: "oi",
      email: "oi@email.com",
      name: "Client 1",
    });

    await ClientModel.create({
      id: client.id.id,
      name: client.name,
      email: client.email,
      address: client.address,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const product = new Product({
      id: new Id("p1"),
      description: "Product 1",
      name: "Product 1",
      salesPrice: 100,
    });

    const order = new Order({
      id: new Id("1"),
      client,
      products: [product],

      status: "pending",
    });

    await checkoutRepository.addOrder(order);

    const orderModel = await OrderModel.findByPk("1", {
      include: [ProductModel, ClientModel],
    });

    expect(orderModel.id).toBe("1");
    expect(orderModel.products).toHaveLength(1);
    expect(orderModel.client.id).toBe("c1");
  });

  it("should find an order", async () => {
    const checkoutRepository = new CheckoutRepository();

    const client = new Client({
      id: new Id("c1"),
      address: "oi",
      email: "oi@email.com",
      name: "Client 1",
    });

    await ClientModel.create({
      id: client.id.id,
      name: client.name,
      email: client.email,
      address: client.address,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const product = new Product({
      id: new Id("p1"),
      description: "Product 1",
      name: "Product 1",
      salesPrice: 100,
    });

    const order = new Order({
      id: new Id("1"),
      client,
      products: [product],
      status: "pending",
    });

    await checkoutRepository.addOrder(order);

    const createdOrder = await checkoutRepository.findOrder("1");

    expect(createdOrder).toBeInstanceOf(Order);
    expect(createdOrder.id).toEqual(new Id("1"));
    expect(createdOrder.total).toBe(100);
    expect(createdOrder.products.length).toBe(1);
    expect(createdOrder.products[0].id).toEqual(new Id("p1"));
  });
});
