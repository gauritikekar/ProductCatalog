import { ProductCatalogRespository } from "./productsCatalogRespositoryInterface";
import * as createProductsCatalogRespository from "../infrastructure/productsCatalogRepository";
import {
  getMergedCatalogProducts,
  getTotalListOfCatalogProducts,
  saveMergedCatalogProduct,
} from "./catalogProduct";

describe("catalogProducts", () => {
  describe("getTotalListOfCatalogProducts", () => {
    const mockProductForA = {
      sku: "1ewe3-34wd",
      description: "product name A",
      source: "A",
    };

    const mockProductForB = {
      sku: "ewhjk3-56hjd",
      description: "product name B",
      source: "B",
    };

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("should return total list of catalog products from companies A and B if products repository returns successfully", async () => {
      const mockGetProductCatalog = jest
        .fn()
        .mockResolvedValueOnce([mockProductForA])
        .mockResolvedValueOnce([mockProductForB]);
      const mockProductRepository: Partial<ProductCatalogRespository> = {
        getProductCatalog: mockGetProductCatalog,
      };

      jest
        .spyOn(
          createProductsCatalogRespository,
          "createProductsCatalogRepository"
        )
        .mockReturnValue(mockProductRepository as ProductCatalogRespository);

      await expect(getTotalListOfCatalogProducts()).resolves.toEqual([
        ...[mockProductForA],
        ...[mockProductForB],
      ]);
    });

    it("should throw error if products repository throw error", async () => {
      const mockGetProductCatalog = jest
        .fn()
        .mockRejectedValue(new Error("Error in getting products"));
      const mockProductRepository: Partial<ProductCatalogRespository> = {
        getProductCatalog: mockGetProductCatalog,
      };

      jest
        .spyOn(
          createProductsCatalogRespository,
          "createProductsCatalogRepository"
        )
        .mockReturnValue(mockProductRepository as ProductCatalogRespository);

      await expect(getTotalListOfCatalogProducts()).rejects.toThrowError(
        "Error in getting products"
      );
    });
  });

  describe("getMergedCatalogProducts", () => {
    it("should return merged catalog product for the given barcode map", () => {
      const mockBarcodeMap = new Map();
      mockBarcodeMap.set("2s332sdsds3232da", {
        source: "A",
        supplierId: "001",
        sku: "1ewe3-34wd",
      });
      const mergedProducts = [
        {
          sku: "1ewe3-34wd",
          description: "product name A",
          source: "A",
        },
      ];

      expect(getMergedCatalogProducts(mockBarcodeMap, mergedProducts)).toEqual(
        mergedProducts
      );
    });
  });

  describe("saveMergedCatalogProduct", () => {
    it("should return true if products repository successfully saves catalog products", async () => {
      const mergedProducts = [
        {
          sku: "1ewe3-34wd",
          description: "product name A",
          source: "A",
        },
      ];
      const mockSaveMergedCatalogProduct = jest
        .fn()
        .mockResolvedValueOnce(true);
      const mockProductRepository: Partial<ProductCatalogRespository> = {
        saveMergedCatalogProduct: mockSaveMergedCatalogProduct,
      };

      jest
        .spyOn(
          createProductsCatalogRespository,
          "createProductsCatalogRepository"
        )
        .mockReturnValue(mockProductRepository as ProductCatalogRespository);

      await expect(
        saveMergedCatalogProduct(mergedProducts)
      ).resolves.toBeTruthy();
    });

    it("should throw error if products repository throw error while saving catalog products", async () => {
      const mergedProducts = [
        {
          sku: "1ewe3-34wd",
          description: "product name A",
          source: "A",
        },
      ];
      const mockSaveMergedCatalogProduct = jest
        .fn()
        .mockRejectedValue(new Error("Error in saving products"));

      const mockProductRepository: Partial<ProductCatalogRespository> = {
        saveMergedCatalogProduct: mockSaveMergedCatalogProduct,
      };

      jest
        .spyOn(
          createProductsCatalogRespository,
          "createProductsCatalogRepository"
        )
        .mockReturnValue(mockProductRepository as ProductCatalogRespository);

      await expect(
        saveMergedCatalogProduct(mergedProducts)
      ).rejects.toThrowError("Error in saving products");
    });
  });
});
