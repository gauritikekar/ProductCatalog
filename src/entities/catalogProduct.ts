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

const getDescription = (
  catalogProducts: CatalogProduct[],
  mapValue: ProductMapValue
): string => {
  const filteredProduct = catalogProducts.filter(
    (product) =>
      product.source === mapValue.source && product.sku === mapValue.sku
  );

  const productDescription =
    filteredProduct && filteredProduct.length > 0
      ? filteredProduct[0].description
      : "";

  return productDescription;
};

const getMergedCatalogProducts = (
  barcodeMap: Map<string, ProductMapValue>,
  totalCatalogProducts: CatalogProduct[]
): CatalogProduct[] => {
  // create a map from barcodeMap with SKU as key to get unique entries for the SKUs
  const skuMap = new Map();
  barcodeMap.forEach((value) => {
    skuMap.set(value.sku, value);
  });

  const mergedProducts: CatalogProduct[] = [];
  skuMap.forEach((value) => {
    const product: CatalogProduct = {
      sku: value.sku,
      description: getDescription(totalCatalogProducts, value),
      source: value.source,
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

const getProducts = async (): Promise<CatalogProduct[]> => {
  const productsCatalogRepository = createProductsCatalogRepository();
  try {
    return await productsCatalogRepository.getMergedCatalogProducts(
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
  getProducts,
};
