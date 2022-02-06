import * as createProductsCatalogRespository from "../infrastructure/productsCatalogRepository";
import {
  getBarcodeToProductMap,
  getSkuToProductMapForMergedCatalogProducts,
} from "./barcode";
import { ProductCatalogRespository } from "./productsCatalogRespositoryInterface";
import * as barcodeEntity from "./barcode";

describe("barcode", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe("getBarcodeToProductMap", () => {
    it("should return map of barcode to products if products repository returns successfully", async () => {
      const expectedBarcodeToProductMap = new Map();
      expectedBarcodeToProductMap.set("z2783613083817", {
        source: "A",
        supplierId: "001",
        sku: "647-vyk-317",
      });
      expectedBarcodeToProductMap.set("z2783613083818", {
        source: "A",
        supplierId: "001",
        sku: "647-vyk-317",
      });

      const mockBarcodeData = [
        {
          source: "A",
          supplierId: "001",
          sku: "647-vyk-317",
          barcode: "z2783613083818",
        },
        {
          source: "A",
          supplierId: "001",
          sku: "647-vyk-317",
          barcode: "z2783613083817",
        },
      ];
      const mockGetBarcodeData = jest.fn().mockResolvedValue(mockBarcodeData);

      const mockProductRepository: Partial<ProductCatalogRespository> = {
        getBarcodeData: mockGetBarcodeData,
      };
      jest
        .spyOn(
          createProductsCatalogRespository,
          "createProductsCatalogRepository"
        )
        .mockReturnValue(mockProductRepository as ProductCatalogRespository);

      const products = await getBarcodeToProductMap("A", "xyz");
      expect(products).toEqual(expectedBarcodeToProductMap);
    });

    it("should throw error if products repository throws error", async () => {
      const mockGetBarcodeData = jest
        .fn()
        .mockRejectedValue(new Error("Error in products repository"));

      const mockProductRepository: Partial<ProductCatalogRespository> = {
        getBarcodeData: mockGetBarcodeData,
      };
      jest
        .spyOn(
          createProductsCatalogRespository,
          "createProductsCatalogRepository"
        )
        .mockReturnValue(mockProductRepository as ProductCatalogRespository);

      await expect(getBarcodeToProductMap("A", "xyz")).rejects.toThrowError(
        "Error in products repository"
      );
    });
  });
  describe("getSkuToProductMapForMergedCatalogProducts", () => {
    it.only("should return unique products in map", async () => {
      const mockBarcodeToProductMapForA = new Map();
      mockBarcodeToProductMapForA.set("z2783613083817", {
        source: "A",
        supplierId: "001",
        sku: "647-vyk-317",
      });
      mockBarcodeToProductMapForA.set("z2783613083818", {
        source: "A",
        supplierId: "001",
        sku: "647-vyk-317",
      });

      const mockBarcodeToProductMapForB = new Map();
      mockBarcodeToProductMapForB.set("z2783613083817", {
        source: "B",
        supplierId: "001",
        sku: "999-vyk-317",
      });

      const mockProducts = [
        {
          sku: "647-vyk-317",
          description: "Walkers Special Old Whiskey",
          source: "A",
        },
        {
          sku: "999-vyk-317",
          description: "Walkers Special Old Whiskey test",
          source: "B",
        },
      ];
      jest
        .spyOn(barcodeEntity, "getBarcodeToProductMap")
        .mockResolvedValueOnce(mockBarcodeToProductMapForA)
        .mockResolvedValueOnce(mockBarcodeToProductMapForB);

      const skuToProductMap = await getSkuToProductMapForMergedCatalogProducts(
        mockProducts
      );
      expect(skuToProductMap).toEqual(mockBarcodeToProductMapForA);
    });
  });
});
