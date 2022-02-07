import csv from "csv-parser";
import fs from "fs";
import { createObjectCsvWriter as createCsvWriter } from "csv-writer";

import { BarcodeFileData } from "../entities/barcode";
import { CatalogProduct } from "../entities/catalogProduct";
import { ProductCatalogRespository } from "../entities/productsCatalogRespositoryInterface";

const createProductsCatalogRepository = (): ProductCatalogRespository => ({
  async getProductCatalog(
    source: string,
    fileName: string
  ): Promise<CatalogProduct[]> {
    return new Promise((resolve, reject) => {
      const products: CatalogProduct[] = [];
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
  ): Promise<BarcodeFileData[]> {
    return new Promise((resolve, reject) => {
      const productsBarcode: BarcodeFileData[] = [];
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

  async saveMergedCatalogProduct(
    products: CatalogProduct[],
    fileName: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const csvWriter = createCsvWriter({
        path: fileName,
        header: [
          { id: "sku", title: "SKU" },
          { id: "description", title: "Description" },
          { id: "source", title: "Source" },
        ],
      });
      csvWriter
        .writeRecords(products)
        .then(() => {
          console.log("The CSV file was written successfully");
          resolve(true);
        })
        .catch((error) => reject(error));
    });
  },

  async getMergedCatalogProducts(
    fileName: string
  ): Promise<CatalogProduct[]> {
    return new Promise((resolve, reject) => {
      const products: CatalogProduct[] = [];
      fs.createReadStream(fileName)
        .pipe(csv())
        .on("data", (data) =>
          products.push({
            source: data.Source,
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

});

export { createProductsCatalogRepository };
