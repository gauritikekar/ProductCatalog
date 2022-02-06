import * as mergeProducts from "../../usecases/getProducts/getProductsInteractor";
import { createMockContext } from "@shopify/jest-koa-mocks";
import { mergedProductsMiddleware } from "./mergedProductsMiddleware";

describe("mergedProductsMiddleware", () => {
  it("should call getMergedProducts only once when the application is loaded", async () => {
    const mockContext = createMockContext({
      url: "http://localhost/products",
    });
    const nextFunction = jest.fn();

    const mergeProductsSpy = jest.spyOn(mergeProducts, "mergeProducts");
    await mergedProductsMiddleware(mockContext, nextFunction);
    expect(mergeProductsSpy).toHaveBeenCalledTimes(1);
  });
});
