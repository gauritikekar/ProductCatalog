import { Context } from "koa";
import { ProductsController } from "./productsControllerInterface";
import { StatusCodes } from "http-status-codes";
import { toHttpStatus } from "../../utils/errors";
import { mergeProducts } from "../../usecases/getProducts/getProductsInteractor";

const createProductsController = (): ProductsController => ({
  handleMergeCatalogProducts: async (ctx: Context) => {
    try {
      await mergeProducts();
      ctx.response.status = StatusCodes.OK;
    } catch (error) {
      ctx.throw(
        toHttpStatus(error),
        error instanceof Error ? error.message : JSON.stringify(error)
      );
    }
  },
});

export { createProductsController };
