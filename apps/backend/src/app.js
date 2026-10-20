import { createServer } from 'node:http';
import { products, formatPrice, summarizeProducts, LIBRARY_NAME } from '@tienda/shared';
export function createApp() {
  return createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    if (req.method !== 'GET') {
      res.writeHead(405, {Allow: 'GET'});
      return res.end(JSON.stringify({error: 'Método no permitido'}));
    }
    if (req.url === '/api/products') {
      return res.end(JSON.stringify({
        application: 'Backend de tienda', sharedLibrary: LIBRARY_NAME,
        products: products.map(product => ({...product, formattedPrice: formatPrice(product.price)})),
        summary: summarizeProducts(products)
      }, null, 2));
    }
    if (req.url === '/api/health') return res.end(JSON.stringify({status: 'ok', sharedLibrary: LIBRARY_NAME}));
    res.writeHead(404);
    res.end(JSON.stringify({error: 'Ruta no encontrada'}));
  });
}

