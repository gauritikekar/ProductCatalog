import csv from "csv-parser";
import fs from "fs";
import { BarcodeData } from "../entities/barcodeData";
import { Product } from "../entities/product";
import { ProductCatalogRespository } from "../entities/productsCatalogRespositoryInterface";

const createProductsCatalogRepository = (): ProductCatalogRespository => ({
  async getProductCatalog(
    source: string,
    fileName: string
  ): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      const products: Product[] = [];
      fs.createReadStream(fileName)
        .pipe(csv())
        .on("data", (data) =>
          products.push({
            source,
            sku: data.SKU,
            description: data.Description,
          })
        )
        .on("end", () => {
          resolve(products);
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  },

  async getBarcodeData(
    source: string,
    fileName: string
  ): Promise<BarcodeData[]> {
    return new Promise((resolve, reject) => {
      const productsBarcode: BarcodeData[] = [];
      fs.createReadStream(fileName)
        .pipe(csv())
        .on("data", (data) =>
          productsBarcode.push({
            source,
            supplierId: data.SupplierID,
            sku: data.SKU,
            barcode: data.Barcode,
          })
        )
        .on("end", () => {
          resolve(productsBarcode);
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  },
});

export { createProductsCatalogRepository };
