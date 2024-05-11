import Id from "../../../@shared/domain/value-object/id.value-object.interface";
import Product from "../../domain/product.entity";
import { PlaceOrderInputDto } from "./place-order.dto";
import PlaceOrderUseCase from "./place-order.usecase";

const mockDate = new Date(2000, 1, 1);

describe("PlaceOrderUsecase unit test", () => {
  describe("ValidateProducts method", () => {
    //@ts-expect-error - no params in contructor
    const placeOrderUseCase = new PlaceOrderUseCase();

    it("should throw an error when no products selected", async () => {
      const input: PlaceOrderInputDto = {
        clientId: "0",
        products: [],
      };

      await expect(
        //@ts-expect-error - force call private method
        placeOrderUseCase.validateProducts(input)
      ).rejects.toThrowError("No products selected");
    });

    it("should throw error when product is out of stock", async () => {
      const mockProductFacade = {
        checkStock: jest.fn(({ productId }: { productId: string }) => {
          return Promise.resolve({
            productId,
            stock: productId === "1" ? 0 : 1,
          });
        }),
      };

      //@ts-expect-error - no params in contructor
      placeOrderUseCase["_productFacade"] = mockProductFacade;

      let input: PlaceOrderInputDto = {
        clientId: "0",
        products: [{ productId: "1" }],
      };

      await expect(
        placeOrderUseCase["validateProducts"](input)
      ).rejects.toThrow(new Error("Product 1 is not available in stock"));

      input = {
        clientId: "0",
        products: [{ productId: "0" }, { productId: "1" }],
      };

      await expect(
        placeOrderUseCase["validateProducts"](input)
      ).rejects.toThrow(new Error("Product 1 is not available in stock"));
      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3);

      input = {
        clientId: "0",
        products: [{ productId: "0" }, { productId: "1" }, { productId: "2" }],
      };

      await expect(
        placeOrderUseCase["validateProducts"](input)
      ).rejects.toThrow(new Error("Product 1 is not available in stock"));
      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5);
    });
  });

  describe("getProduct method", () => {
    beforeAll(() => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    //@ts-expect-error - no params in contructor
    const placeOrderUseCase = new PlaceOrderUseCase();

    it("should throw error when product not found", async () => {
      const mockCatalogFacade = {
        find: jest.fn().mockResolvedValue(null),
      };

      //@ts-expect-error - force set catalogFacade
      placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

      await expect(placeOrderUseCase["getProduct"]("0")).rejects.toThrowError(
        "Product not found"
      );
    });

    it("should return product when found", async () => {
      const mockCatalogFacade = {
        find: jest.fn().mockResolvedValue({
          id: "0",
          name: "Product 1",
          description: "Description",
          salesPrice: 0,
        }),
      };

      //@ts-expect-error - force set catalogFacade
      placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

      const product = await placeOrderUseCase["getProduct"]("0");
      expect(product).toEqual(
        new Product({
          id: new Id("0"),
          name: "Product 1",
          description: "Description",
          salesPrice: 0,
        })
      );

      expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1);
    });
  });

  describe("execute method", () => {
    it("should throw an error when client not found", async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(null),
      };

      //@ts-expect-error - no params in contructor
      const placeOrderUseCase = new PlaceOrderUseCase();

      //@ts-expect-error - force set clientFacade
      placeOrderUseCase["_clientFacade"] = mockClientFacade;

      const input: PlaceOrderInputDto = {
        clientId: "1",
        products: [],
      };

      await expect(placeOrderUseCase.execute(input)).rejects.toThrowError(
        "Client not found"
      );
    });

    it("should throw an error when products are not valid", async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(true),
      };

      //@ts-expect-error - no params in contructor
      const placeOrderUseCase = new PlaceOrderUseCase(mockClientFacade);

      const mockValidateProducts = jest
        //@ts-expect-error - spy on private method
        .spyOn(placeOrderUseCase, "validateProducts")
        //@ts-expect-error - not return never
        .mockRejectedValue(new Error("No products selected"));

      const input: PlaceOrderInputDto = {
        clientId: "1",
        products: [],
      };

      await expect(placeOrderUseCase.execute(input)).rejects.toThrowError(
        "No products selected"
      );
      expect(mockValidateProducts).toHaveBeenCalledTimes(1);
    });

    describe("place an order", () => {
      const clientProps = {
        id: "1",
        name: "Client",
        address: "Address",
        email: "asd@email.com",
        document: "123456789",
        street: "Street",
        number: 1,
        city: "City",
        state: "State",
        zipCode: "123456",
        complement: "Complement",
      };

      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(clientProps),
        add: jest.fn(),
      };

      const mockPaymentFacade = {
        process: jest.fn(),
      };

      const mockCheckoutRepository = {
        findOrder: jest.fn(),
        addOrder: jest.fn(),
      };

      const mockInvoiceFacade = {
        find: jest.fn(),
        generate: jest.fn().mockResolvedValue({
          id: "1",
        }),
      };

      const placeOrderUseCase = new PlaceOrderUseCase(
        mockClientFacade,
        null,
        null,
        mockCheckoutRepository as any,
        mockInvoiceFacade as any,
        mockPaymentFacade as any
      );

      const products = {
        "1": new Product({
          id: new Id("1"),
          name: "Product 1",
          description: "Description",
          salesPrice: 50,
        }),
        "2": new Product({
          id: new Id("2"),
          name: "Product 2",
          description: "Description",
          salesPrice: 20,
        }),
      };

      const mockValidateProducts = jest
        //@ts-expect-error - spy on private method
        .spyOn(placeOrderUseCase, "validateProducts")
        //@ts-expect-error - spy on private method
        .mockResolvedValue(null);

      const mockGetProduct = jest
        //@ts-expect-error - spy on private method
        .spyOn(placeOrderUseCase, "getProduct")
        //@ts-expect-error - not return never
        .mockImplementation((id: keyof typeof products) => {
          return products[id];
        });

      it("should not be approved", async () => {
        mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
          transactionId: "1t",
          orderId: "1o",
          amout: 100,
          status: "error",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const input: PlaceOrderInputDto = {
          clientId: "1c",
          products: [{ productId: "1" }, { productId: "2" }],
        };

        let output = await placeOrderUseCase.execute(input);
        expect(output.invoiceId).toBe(null);

        expect(output.total).toBe(70);
        expect(output.products).toStrictEqual([
          {
            productId: "1",
          },
          {
            productId: "2",
          },
        ]);
        expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
        expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "1c" });
        expect(mockValidateProducts).toHaveBeenCalledWith(input);
        expect(mockGetProduct).toHaveBeenCalledTimes(2);
        expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledWith({
          orderId: output.id,
          amount: output.total,
        });
        expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(0);
      });

      it("should be approved", async () => {
        mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
          transactionId: "1t",
          orderId: "1o",
          amout: 100,
          status: "approved",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const input: PlaceOrderInputDto = {
          clientId: "1c",
          products: [{ productId: "1" }, { productId: "2" }],
        };

        let output = await placeOrderUseCase.execute(input);
        expect(output.invoiceId).toBe("1");

        expect(output.total).toBe(70);
        expect(output.products).toStrictEqual([
          {
            productId: "1",
          },
          {
            productId: "2",
          },
        ]);
        expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
        expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "1c" });
        expect(mockValidateProducts).toHaveBeenCalledWith(input);
        expect(mockGetProduct).toHaveBeenCalledTimes(2);
        expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledWith({
          orderId: output.id,
          amount: output.total,
        });
        expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(1);
        expect(mockInvoiceFacade.generate).toHaveBeenCalledWith({
          name: clientProps.name,
          document: clientProps.address,
          state: clientProps.address,
          city: clientProps.address,
          zipCode: clientProps.address,
          street: clientProps.address,
          complement: clientProps.address,
          number: clientProps.number,
          items: [
            {
              id: products["1"].id.id,
              name: products["1"].name,
              price: products["1"].salesPrice,
            },
            {
              id: products["2"].id.id,
              name: products["2"].name,
              price: products["2"].salesPrice,
            },
          ],
        });
      });
    });
  });
});
