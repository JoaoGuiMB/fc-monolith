import Address from "../../@shared/domain/value-object/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object.interface";
import OrderModel from "./order.model";
import Order from "../domain/order.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import ProductModel from "./product.model";
import Product from "../domain/product.entity";
import Client from "../domain/client.entity";
import { ClientModel } from "./client.model";

export default class CheckoutRepository implements CheckoutGateway {
  async addOrder(order: Order): Promise<void> {
    try {
      await OrderModel.create(
        {
          id: order.id.id,
          client_id: order.client.id.id,
          status: order.status,
          products: order.products.map((product) => {
            return {
              id: product.id.id,
              name: product.name,
              salesPrice: product.salesPrice,
              description: product.description,
            };
          }),
          client: order.client,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          include: [
            {
              model: ProductModel,
              as: "products",
            },
          ],
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  async findOrder(id: string): Promise<Order> {
    const order = await OrderModel.findOne({
      where: { id },
      include: ["products"],

      rejectOnEmpty: true,
    });

    if (!order) {
      throw new Error(`order with id ${id} not found`);
    }
    const foundClient = await ClientModel.findOne({
      where: { id: order.client_id },
    });

    const products = order.products.map((item) => {
      return new Product({
        id: new Id(item.id),
        name: item.name,
        salesPrice: item.salesPrice,
        description: item.description,
      });
    });

    return new Order({
      id: new Id(order.id),
      client: new Client({
        id: new Id(foundClient.id),
        name: foundClient.name,
        email: foundClient.email,
        address: foundClient.address,
      }),
      status: order.status,
      products,
    });
  }
}
