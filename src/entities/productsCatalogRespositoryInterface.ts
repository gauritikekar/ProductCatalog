import { BarcodeData } from "./barcodeData";
import { Product } from "./product";

interface ProductCatalogRespository {
  getProductCatalog(source: string, fileName: string): Promise<Product[]>;
  getBarcodeData(source: string, fileName: string): Promise<BarcodeData[]>;
}

export { ProductCatalogRespository };
