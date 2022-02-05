import { ComposedMiddleware } from "koa-compose";
import { Context } from "koa";

interface ProductsController {
  handleGetProducts: ComposedMiddleware<Context>;
}

export { ProductsController };
