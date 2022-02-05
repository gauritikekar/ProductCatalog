import { StatusCodes } from "http-status-codes";
import { Product } from "../../entities/product";
import { createProductsCatalogRepository } from "../../infrastructure/productsCatalogRepository";
import { errors } from "../../utils/errors";

interface BarcodeMapValue {
  source: string;
  supplierId: string;
  sku: string;
}

const productsCatalogRepository = createProductsCatalogRepository();

const getProductCatalogData = async (
  source: string,
  fileName: string
): Promise<Product[]> => {
  return await productsCatalogRepository.getProductCatalog(source, fileName);
};

const getProductBarcodeData = async (
  source: string,
  fileName: string
): Promise<Map<string, BarcodeMapValue>> => {
  try {
    const barcodeData = await productsCatalogRepository.getBarcodeData(
      source,
      fileName
    );
    const barcodeMap = new Map();
    barcodeData.forEach((data) =>
      barcodeMap.set(data.barcode, {
        source: data.source,
        supplierId: data.supplierId,
        sku: data.sku,
      })
    );
    return barcodeMap;
  } catch (error) {
    throw error;
  }
};

const getProducts = async (): Promise<Product[]> => {
  const product: Product[] = [
    {
      sku: "1ewe3-34wd",
      description: "product name",
      source: "A",
    },
  ];

  try {
    const productCatalogForA = getProductCatalogData(
      "A",
      "./src/infrastructure/fileStorage/input/catalogA.csv"
    );
    const productCatalogForB = getProductCatalogData(
      "B",
      "./src/infrastructure/fileStorage/input/catalogB.csv"
    );

    const barcodeMapForA = getProductBarcodeData(
      "A",
      "./src/infrastructure/fileStorage/input/barcodesA.csv"
    );

    const barcodeMapForB = getProductBarcodeData(
      "B",
      "./src/infrastructure/fileStorage/input/barcodesB.csv"
    );
    return Promise.resolve(product);
  } catch (error) {
    console.log("error");
    throw errors.createHttpError(
      new Error(`Error in getting products catalog`),
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export { getProducts };
