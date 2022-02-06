import { ProductCatalogRespository } from "../../entities/productsCatalogRespositoryInterface";
import { getMergedProducts } from "./getProductsInteractor";
import * as productsEntity from "../../entities/catalogProduct";
import * as barcodeEntity from "../../entities/barcode";
import { resolve } from "path/posix";

describe("getProducts", () => {
  const mockProduct = {
    sku: "1ewe3-34wd",
    description: "product name",
    source: "A",
  };

  const getListOfTotalProductsSpy = jest.spyOn(
    productsEntity,
    "getTotalListOfCatalogProducts"
  );
  const saveMergedCatalogProductSpy = jest.spyOn(
    productsEntity,
    "saveMergedCatalogProduct"
  );
  const getMergedCatalogProductsSpy = jest
    .spyOn(productsEntity, "getMergedCatalogProducts")
    .mockReturnValue([mockProduct]);

  const getSkuToProductMapForMergedCatalogProductsSpy = jest.spyOn(
    barcodeEntity,
    "getSkuToProductMapForMergedCatalogProducts"
  );

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return merged products if products entity returns merged products successfully", async () => {
    const products = await getMergedProducts();

    expect(getListOfTotalProductsSpy).toHaveBeenCalled();
    expect(getSkuToProductMapForMergedCatalogProductsSpy).toHaveBeenCalled();
    expect(getMergedCatalogProductsSpy).toHaveBeenCalled();
    expect(saveMergedCatalogProductSpy).toHaveBeenCalled();
    expect(products).toEqual([mockProduct]);
  });

  it.each`
    entity            | functionName                                    | description
    ${productsEntity} | ${"getTotalListOfCatalogProducts"}              | ${"products entity throws error while getting total list of catalog products"}
    ${productsEntity} | ${"saveMergedCatalogProduct"}                   | ${"products entity throws error while saving merged catalog products"}
    ${productsEntity} | ${"getMergedCatalogProducts"}                   | ${"products entity throws error while getting merged catalog products"}
    ${barcodeEntity}  | ${"getSkuToProductMapForMergedCatalogProducts"} | ${"barcode entity throws error while getting sku to product map"}
  `("should throw error if $description", async ({ entity, functionName }) => {
    jest
      .spyOn(entity, functionName)
      .mockRejectedValue(new Error("Error in getting products catalog"));
    await expect(getMergedProducts()).rejects.toThrowError(
      "Error in getting products catalog"
    );
  });
});
