import { Product } from "../entities/product";
import { ProductCatalogRespository } from "../entities/productsCatalogRespositoryInterface";

const createProductsCatalogRepository = (): ProductCatalogRespository => ({
  async getProductCatalog(source: string, fileName: string): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      const catalogProducts: Product[] = [
        {
          source,
          sku: "647-vyk-317",
          description: "Walkers Special Old Whiskey",
        },
        { source, sku: "280-oad-768", description: "Bread - Raisin" },
        { source, sku: "165-rcy-650", description: "Tea - Decaf 1 Cup" },
        { source, sku: "167-eol-949", description: "Cheese - Grana Padano" },
        {
          source,
          sku: "650-epd-782",
          description: "Carbonated Water - Lemon Lime",
        },
      ];
      return Promise.resolve(catalogProducts);
    });
  },

  async getBarcodeData(source: string, fileName: string): Promise<BarcodeData[]> {
    return new Promise((resolve, reject) => {
      const barcodeData: BarcodeData[] = [
        {
          source,
          supplierId: '1',
          sku: "647-vyk-317",
          barcode: "z2783613083817"
        },
        {
          source,
          supplierId: '1',
          sku: "147-vyk-317",
          barcode: "r2783613083817"
        },
        {
          source,
          supplierId: '2',
          sku: "111-vyk-317",
          barcode: "rrr783613083817"
        },
      ];
      return Promise.resolve(barcodeData);
    });
  } 
})

export { createProductsCatalogRepository };
