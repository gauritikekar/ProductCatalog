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

const getBarcodeMap = async (
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

const getUniqueMergedBarcodeMap = (
  barcodeMapA: Map<string, ProductMapValue>,
  barcodeMapB: Map<string, ProductMapValue>
): Map<string, ProductMapValue> => {
  barcodeMapA.forEach((value, key) => {
    if (barcodeMapB.has(key)) {
      // remove duplicate entries from source B
      barcodeMapB.delete(key);
    }
  });
  return new Map([...barcodeMapA, ...barcodeMapB]);
};

const getBarcodeMapForMergedCatalogProducts = async (): Promise<
  Map<string, ProductMapValue>
> => {
  const barcodeMapA = await getBarcodeMap(
    "A",
    "./src/infrastructure/fileStorage/input/barcodesA.csv"
  );
  const barcodeMapB = await getBarcodeMap(
    "B",
    "./src/infrastructure/fileStorage/input/barcodesB.csv"
  );

  return getUniqueMergedBarcodeMap(barcodeMapA, barcodeMapB);
};

export {
  BarcodeFileData,
  ProductMapValue,
  getBarcodeMap,
  getBarcodeMapForMergedCatalogProducts,
};
