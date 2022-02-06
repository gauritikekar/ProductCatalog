import { mergeProducts } from "./getProductsInteractor";
import * as productsEntity from "../../entities/catalogProduct";
import * as barcodeEntity from "../../entities/barcode";

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

  it("should save merged products in output fileproducts entity returns merged products successfully", async () => {
    await mergeProducts();

    expect(getListOfTotalProductsSpy).toHaveBeenCalled();
    expect(getSkuToProductMapForMergedCatalogProductsSpy).toHaveBeenCalled();
    expect(getMergedCatalogProductsSpy).toHaveBeenCalled();
    expect(saveMergedCatalogProductSpy).toHaveBeenCalled();
  });

  it.each`
    entity            | functionName                                    | description
    ${productsEntity} | ${"getTotalListOfCatalogProducts"}              | ${"products entity throws error while getting total list of catalog products"}
    ${productsEntity} | ${"saveMergedCatalogProduct"}                   | ${"products entity throws error while saving merged catalog products"}
    ${barcodeEntity}  | ${"getSkuToProductMapForMergedCatalogProducts"} | ${"barcode entity throws error while getting sku to product map"}
  `("should throw error if $description", async ({ entity, functionName }) => {
    jest
      .spyOn(entity, functionName)
      .mockRejectedValue(new Error("Error in getting products catalog"));
    await expect(mergeProducts()).rejects.toThrowError(
      "Error in getting products catalog"
    );
  });
});
