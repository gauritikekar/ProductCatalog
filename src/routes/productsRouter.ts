import Router from "koa-router";
import { createProductsController } from "../application/product/productsController";

const productsRouter = new Router();
const productsController = createProductsController();

productsRouter.get("/products", productsController.handleGetProducts);

export { productsRouter };
