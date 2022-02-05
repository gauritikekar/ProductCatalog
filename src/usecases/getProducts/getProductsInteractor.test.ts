import { ProductCatalogRespository } from "../../entities/productsCatalogRespositoryInterface";
import { getProducts } from "./getProductsInteractor";
import * as createProductsCatalogRespository from "../../infrastructure/productsCatalogRepository";

describe("getProducts", () => {
  const mockProduct = {
    sku: "1ewe3-34wd",
    description: "product name",
    source: "A",
  };

  it("should return all the products if products repository returns products", async () => {
    const mockGetProductCatalog = jest.fn().mockResolvedValue([mockProduct]);
    const mockProductRepository: Partial<ProductCatalogRespository> = {
      getProductCatalog: mockGetProductCatalog,
    };

    jest
      .spyOn(
        createProductsCatalogRespository,
        "createProductsCatalogRepository"
      )
      .mockReturnValue(mockProductRepository as ProductCatalogRespository);

    const products = await getProducts();

    expect(products).toEqual([mockProduct]);
  });

  it.skip("should throw error if products repository throws error", async () => {
    const mockGetProductCatalog = jest
      .fn()
      .mockRejectedValue(new Error("Error in getting products"));
    const mockProductCatalogRepository: Partial<ProductCatalogRespository> = {
      getProductCatalog: mockGetProductCatalog,
    };

    jest
      .spyOn(
        createProductsCatalogRespository,
        "createProductsCatalogRepository"
      )
      .mockReturnValue(
        mockProductCatalogRepository as ProductCatalogRespository
      );

    await expect(getProducts()).rejects.toThrowError(
      "Error in getting products"
    );
  });
});
