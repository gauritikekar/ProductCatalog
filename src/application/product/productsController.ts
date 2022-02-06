import { Context } from "koa";
import { ProductsController } from "./productsControllerInterface";
import { StatusCodes } from "http-status-codes";
import { toHttpStatus } from "../../utils/errors";
import { getProducts } from "../../usecases/getProducts/getProductsInteractor";

const createProductsController = (): ProductsController => ({
  handleMergeCatalogProducts: async (ctx: Context) => {
    try {
      const products = await getProducts();
      ctx.response.status = StatusCodes.OK;
      ctx.body = products;
    } catch (error) {
      ctx.throw(
        toHttpStatus(error),
        error instanceof Error ? error.message : JSON.stringify(error)
      );
    }
  },
});

export { createProductsController };
