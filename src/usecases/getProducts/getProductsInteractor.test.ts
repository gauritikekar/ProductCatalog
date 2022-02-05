import { getProducts } from "./getProductsInteractor";

describe("getProducts", () => {
  const mockProduct = {
    sku: "1ewe3-34wd",
    description: "product name",
    source: "A",
  };

  it("should return all the products", async () => {
    const products = await getProducts();

    expect(products).toEqual([mockProduct]);
  });
});
