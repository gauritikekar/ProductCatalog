import { createProductsCatalogRepository } from "../infrastructure/productsCatalogRepository";
import { CatalogProduct } from "./catalogProduct";

interface BarcodeFileData {
  source: string;
  supplierId: string;
  sku: string;
  barcode: string;
}

interface ProductMapValue {
  source: string;
  supplierId: string;
  sku: string;
  description?: string;
}

const getBarcodeToProductMap = async (
  source: string,
  fileName: string
): Promise<Map<string, ProductMapValue>> => {
  const productsCatalogRepository = createProductsCatalogRepository();

  try {
    const barcodeData = await productsCatalogRepository.getBarcodeData(
      source,
      fileName
    );

    const barcodeToProductMap = new Map();

    barcodeData.forEach((data) =>
      barcodeToProductMap.set(data.barcode, {
        source: data.source,
        supplierId: data.supplierId,
        sku: data.sku,
      })
    );
    return barcodeToProductMap;
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

const getSkuToProductMapForMergedCatalogProducts = async (
  catalogProducts: CatalogProduct[]
): Promise<Map<string, ProductMapValue>> => {
  // map for barcode to product data
  const barcodeToProductMapForA = await getBarcodeToProductMap(
    "A",
    "./src/infrastructure/fileStorage/input/barcodesA.csv"
  );
  const barcodeToProductMapForB = await getBarcodeToProductMap(
    "B",
    "./src/infrastructure/fileStorage/input/barcodesB.csv"
  );

  // map for sku to product data
  const skuToProductMap: Map<string, ProductMapValue> = new Map();

  barcodeToProductMapForA.forEach((value, key) => {
    if (barcodeToProductMapForB.has(key)) {
      // remove duplicate entries from source B
      barcodeToProductMapForB.delete(key);
    }

    // only unique entried will be added from source A
    skuToProductMap.set(value.sku, {
      ...value,
      description: getDescription(catalogProducts, value),
    });
  });

  barcodeToProductMapForB.forEach((value, key) => {
    // only unique entried will be added from source B
    skuToProductMap.set(value.sku, {
      ...value,
      description: getDescription(catalogProducts, value),
    });
  });
  return skuToProductMap;
};

export {
  BarcodeFileData,
  ProductMapValue,
  getBarcodeToProductMap,
  getSkuToProductMapForMergedCatalogProducts,
};
