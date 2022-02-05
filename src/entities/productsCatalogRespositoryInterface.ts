import { Product } from "./product";

interface ProductsCatalogRespository {
  getProductsCatalog(source: string, fileName: string): Promise<Product[]>;
  getBarcodeData(source: string, fileName: string): Promise<BarcodeData[]>;
}

export { ProductsCatalogRespository };
