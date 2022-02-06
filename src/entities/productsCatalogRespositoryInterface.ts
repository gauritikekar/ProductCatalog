import { BarcodeFileData } from "./barcode";
import { CatalogProduct } from "./catalogProduct";

interface ProductCatalogRespository {
  getProductCatalog(
    source: string,
    fileName: string
  ): Promise<CatalogProduct[]>;
  getBarcodeData(source: string, fileName: string): Promise<BarcodeFileData[]>;
  saveMergedCatalogProduct(
    products: CatalogProduct[],
    fileName: string
  ): Promise<boolean>;
}

export { ProductCatalogRespository };
