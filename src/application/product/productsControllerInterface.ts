import { ComposedMiddleware } from "koa-compose";
import { Context } from "koa";

interface ProductsController {
  handleGetCatalogProducts: ComposedMiddleware<Context>;
}

export { ProductsController };
