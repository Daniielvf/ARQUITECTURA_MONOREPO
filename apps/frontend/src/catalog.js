import { formatPrice, summarizeProducts, LIBRARY_NAME } from '@tienda/shared';
export function catalogView(data) {
  return {
    library: LIBRARY_NAME,
    backendLibrary: data.sharedLibrary,
    products: data.products.map(product => ({...product, displayPrice: formatPrice(product.price)})),
    summary: summarizeProducts(data.products),
    inventoryValue: formatPrice(summarizeProducts(data.products).inventoryValue)
  };
}

