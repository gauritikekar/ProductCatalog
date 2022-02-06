import { StatusCodes } from "http-status-codes";
import { getSkuToProductMapForMergedCatalogProducts } from "../../entities/barcode";
import {
  CatalogProduct,
  getMergedCatalogProducts,
  getTotalListOfCatalogProducts,
  saveMergedCatalogProduct,
} from "../../entities/catalogProduct";
import { errors } from "../../utils/errors";

const mergeProducts = async (): Promise<boolean> => {
  try {
    const totalListOfCatalogProducts = await getTotalListOfCatalogProducts();

    const skuToProductsMapForMergedProducts =
      await getSkuToProductMapForMergedCatalogProducts(
        totalListOfCatalogProducts
      );

    const mergedProducts = getMergedCatalogProducts(
      skuToProductsMapForMergedProducts
    );

    return await saveMergedCatalogProduct(mergedProducts);
  } catch (error) {
    console.log("error", error);
    throw errors.createHttpError(
      new Error(`Error in getting products catalog`),
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export { mergeProducts };
