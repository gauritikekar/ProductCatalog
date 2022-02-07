import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "koa2-cors";
import logger from "koa-logger";
import { config } from "./config";
import { productsRouter } from "./routes/productsRouter";
import { mergeProductsMiddleware } from "./application/middleware/mergedProductsMiddleware";

const app = new Koa();

const PORT = config.port;

app.use(bodyParser());
app.use(
  cors({
    origin: "*",
  })
);
app.use(logger());
app.use(mergeProductsMiddleware);
app.use(productsRouter.routes());

const server = app
  .listen(PORT, async () => {
    console.log(`Server listening on port: ${PORT}`);
  })
  .on("error", (err) => {
    console.error(err);
  });

export default server;
