import { createProductsController } from "./productsController";
import { StatusCodes } from "http-status-codes";
import { createMockContext } from "@shopify/jest-koa-mocks";
import * as getProductsInteractor from "../../usecases/getProducts/getProductsInteractor";

describe("productsController", () => {
  const mockProducts = [
    {
      sku: "647-vyk-317",
      description: "Walkers Special Old Whiskey",
      source: "A",
    },
    {
      sku: "280-oad-768",
      description: "Bread - Raisin",
      source: "A",
    },
    {
      sku: "999-eol-949",
      description: "Cheese - Grana Padano",
      source: "B",
    },
  ];

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("handleGetCatalogProducts", () => {
    it("should return all the merged and unique products if succesfully received from the products interactor", async () => {
      const mockContext = createMockContext({
        url: "http://localhost/products",
      });

      const getProductSpy = jest
        .spyOn(getProductsInteractor, "getMergedProducts")
        .mockResolvedValue(mockProducts);

      await createProductsController().handleGetCatalogProducts(mockContext);
      expect(getProductSpy).toHaveBeenCalled();
      expect(mockContext.status).toEqual(StatusCodes.OK);
      expect(mockContext.body).toEqual(mockProducts);
    });

    it("should throw error if products interactor throws error", async () => {
      const mockContext = createMockContext({
        url: "http://localhost/product",
      });

      jest
        .spyOn(getProductsInteractor, "getMergedProducts")
        .mockRejectedValue(new Error("Error in receiving products"));

      await createProductsController().handleGetCatalogProducts(mockContext);
      expect(mockContext.throw).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error in receiving products"
      );
    });
  });
});
