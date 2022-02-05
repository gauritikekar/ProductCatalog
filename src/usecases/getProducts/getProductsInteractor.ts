import { Product } from "../../entities/product";

const getProducts = async (): Promise<Product[]> => {
  const product: Product[] = [{
    sku: "1ewe3-34wd",
    description: "product name",
    source: "A",
  }];
  return Promise.resolve(product);
};

export { getProducts };
