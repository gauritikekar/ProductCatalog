import { ComposedMiddleware } from "koa-compose";
import { Context } from "koa";

interface ProductsController {
  handleMergeCatalogProducts: ComposedMiddleware<Context>;
}

export { ProductsController };
