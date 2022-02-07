import { StatusCodes } from "http-status-codes";
import { Context, Middleware, Next } from "koa";
import { mergeProducts } from "../../usecases/getProducts/getProductsInteractor";
import { toHttpStatus } from "../../utils/errors";

let isLoaded = false;

const mergeProductsMiddleware: Middleware = async (
  ctx: Context,
  next: Next
) => {
  try {
    if (!isLoaded) {
      await mergeProducts();
      isLoaded = true;
    }
    return await next();
  } catch (error) {
    console.log("error", error);
    ctx.throw(
      toHttpStatus(error),
      error instanceof Error ? error.message : JSON.stringify(error)
    );
  }
};

export { mergeProductsMiddleware };
