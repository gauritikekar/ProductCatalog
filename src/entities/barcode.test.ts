import * as createProductsCatalogRespository from "../infrastructure/productsCatalogRepository";
import {
  getBarcodeToProductMap,
  getSkuToProductMapForMergedCatalogProducts,
} from "./barcode";
import { ProductCatalogRespository } from "./productsCatalogRespositoryInterface";

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
    it("should return unique products in map", async () => {
      const expectedMergedSkuToProductMap = new Map();
      expectedMergedSkuToProductMap.set("647-vyk-317", {
        source: "A",
        description: "Walkers Special Old Whiskey",
        sku: "647-vyk-317",
        supplierId: "001",
      });

      expectedMergedSkuToProductMap.set("280-oad-768", {
        source: "A",
        description: "Bread - Raisin",
        sku: "280-oad-768",
        supplierId: "002",
      });

      const mockProducts = [
        {
          sku: "647-vyk-317",
          description: "Walkers Special Old Whiskey",
          source: "A",
        },
        {
          sku: "280-oad-768",
          description: "Bread - Raisin",
          source: "A",
        },
        {
          sku: "999-vyk-317",
          description: "Walkers Special Old Whiskey test",
          source: "B",
        },
      ];

      const mockBarcodeDataForA = [
        {
          source: "A",
          supplierId: "001",
          sku: "647-vyk-317",
          barcode: "z2783613083817",
        },
        {
          source: "A",
          supplierId: "002",
          sku: "280-oad-768",
          barcode: "p2359014924610",
        },
      ];
      const mockBarcodeDataForB = [
        {
          source: "B",
          supplierId: "001",
          sku: "999-vyk-317",
          barcode: "z2783613083817",
        },
      ];

      const mockGetBarcodeData = jest
        .fn()
        .mockResolvedValueOnce(mockBarcodeDataForA)
        .mockResolvedValueOnce(mockBarcodeDataForB);

      const mockProductRepository: Partial<ProductCatalogRespository> = {
        getBarcodeData: mockGetBarcodeData,
      };

      jest
        .spyOn(
          createProductsCatalogRespository,
          "createProductsCatalogRepository"
        )
        .mockReturnValue(mockProductRepository as ProductCatalogRespository);

      const skuToProductMap = await getSkuToProductMapForMergedCatalogProducts(
        mockProducts
      );
      expect(skuToProductMap).toEqual(expectedMergedSkuToProductMap);
    });

    it("should return product only from source A if the same exist in source B", async () => {
      const expectedMergedSkuToProductMap = new Map();
      expectedMergedSkuToProductMap.set("647-vyk-317", {
        source: "A",
        description: "Walkers Special Old Whiskey",
        sku: "647-vyk-317",
        supplierId: "001",
      });

      const mockProducts = [
        {
          sku: "647-vyk-317",
          description: "Walkers Special Old Whiskey",
          source: "A",
        },
      ];

      const mockBarcodeDataForA = [
        {
          source: "A",
          supplierId: "001",
          sku: "647-vyk-317",
          barcode: "z2783613083817",
        },
      ];
      const mockBarcodeDataForB = [
        {
          source: "B",
          supplierId: "001",
          sku: "999-vyk-317",
          barcode: "z2783613083817",
        },
      ];

      const mockGetBarcodeData = jest
        .fn()
        .mockResolvedValueOnce(mockBarcodeDataForA)
        .mockResolvedValueOnce(mockBarcodeDataForB);

      const mockProductRepository: Partial<ProductCatalogRespository> = {
        getBarcodeData: mockGetBarcodeData,
      };

      jest
        .spyOn(
          createProductsCatalogRespository,
          "createProductsCatalogRepository"
        )
        .mockReturnValue(mockProductRepository as ProductCatalogRespository);

      const skuToProductMap = await getSkuToProductMapForMergedCatalogProducts(
        mockProducts
      );
      expect(skuToProductMap).toEqual(expectedMergedSkuToProductMap);
    });
  });
});
