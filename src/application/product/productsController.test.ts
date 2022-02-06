import { createProductsController } from "./productsController";
import { StatusCodes } from "http-status-codes";
import { createMockContext } from "@shopify/jest-koa-mocks";
import * as getProductsInteractor from "../../usecases/getProducts/getProductsInteractor";

describe("productsController", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("handleGetProducts", () => {
    it("should return status ok if products interactor returns successfully merged products", async () => {
      const mockContext = createMockContext({
        url: "http://localhost/products",
      });

      const getProductSpy = jest
        .spyOn(getProductsInteractor, "mergeProducts")
        .mockResolvedValue(true);

      await createProductsController().handleMergeCatalogProducts(mockContext);
      expect(getProductSpy).toHaveBeenCalled();
      expect(mockContext.status).toEqual(StatusCodes.OK);
    });

    it("should throw error if products interactor throws error", async () => {
      const mockContext = createMockContext({
        url: "http://localhost/product",
      });

      jest
        .spyOn(getProductsInteractor, "mergeProducts")
        .mockRejectedValue(new Error("Error in receiving products"));

      await createProductsController().handleMergeCatalogProducts(mockContext);
      expect(mockContext.throw).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error in receiving products"
      );
    });
  });
});
