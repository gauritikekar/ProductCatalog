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

const getSkuToProductMapForMergedCatalogProducts = async (
  catalogProducts: CatalogProduct[]
): Promise<Map<string, ProductMapValue>> => {
  const barcodeToProductMapForA = await getBarcodeToProductMap(
    "A",
    "./src/infrastructure/fileStorage/input/barcodesA.csv"
  );
  const barcodeToProductMapForB = await getBarcodeToProductMap(
    "B",
    "./src/infrastructure/fileStorage/input/barcodesB.csv"
  );

  console.log('barcodeToProductMapForA', barcodeToProductMapForA);
  
  const skuToProductMap: Map<string, ProductMapValue> = new Map();

  barcodeToProductMapForA.forEach((value, key) => {
    if (barcodeToProductMapForB.has(key)) {
      barcodeToProductMapForB.delete(key);
    }

    const productDescription = catalogProducts.filter(
      (product) => product.source === value.source && product.sku === value.sku
    )[0].description;

    skuToProductMap.set(value.sku, {
      ...value,
      description: productDescription,
    });
  });

  barcodeToProductMapForB.forEach((value, key) => {
    // TODO this to be removed to a common place
    const productDescription = catalogProducts.filter(
      (product) => product.source === value.source && product.sku === value.sku
    )[0].description;

    skuToProductMap.set(value.sku, {
      ...value,
      description: productDescription,
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
