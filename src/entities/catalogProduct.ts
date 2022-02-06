import { createProductsCatalogRepository } from "../infrastructure/productsCatalogRepository";
import { ProductMapValue } from "./barcode";

interface CatalogProduct {
  sku: string;
  description: string;
  source: string;
}

const getTotalListOfCatalogProducts = async (): Promise<CatalogProduct[]> => {
  const productsCatalogRepository = createProductsCatalogRepository();
  try {
    const productsFromCatalogA =
      await productsCatalogRepository.getProductCatalog(
        "A",
        "./src/infrastructure/fileStorage/input/catalogA.csv"
      );
    const productsFromCatalogB =
      await productsCatalogRepository.getProductCatalog(
        "B",
        "./src/infrastructure/fileStorage/input/catalogB.csv"
      );

    return [...productsFromCatalogA, ...productsFromCatalogB];
  } catch (error) {
    throw error;
  }
};

const getMergedCatalogProducts = (
  skuToProductsMap: Map<string, ProductMapValue>
): CatalogProduct[] => {
  const mergedProducts: CatalogProduct[] = [];
  skuToProductsMap.forEach((item) => {
    const product: CatalogProduct = {
      sku: item.sku,
      description: item.description ?? "",
      source: item.source,
    };
    mergedProducts.push(product);
  });
  return mergedProducts;
};

const saveMergedCatalogProduct = async (
  products: CatalogProduct[]
): Promise<boolean> => {
  const productsCatalogRepository = createProductsCatalogRepository();
  try {
    return await productsCatalogRepository.saveMergedCatalogProduct(
      products,
      "./src/infrastructure/fileStorage/output/result_output.csv"
    );
  } catch (error) {
    throw error;
  }
};

export {
  CatalogProduct,
  getTotalListOfCatalogProducts,
  getMergedCatalogProducts,
  saveMergedCatalogProduct,
};
