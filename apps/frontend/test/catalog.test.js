import { test } from 'node:test';
import assert from 'node:assert/strict';
import { catalogView } from '../src/catalog.js';
test('frontend calcula precios y totales desde datos de API sin confiar en su formato', () => {
  const view = catalogView({sharedLibrary: '@tienda/shared', products: [{id: 8, name: 'Prueba', price: 12.5, stock: 4, formattedPrice: 'ignorado'}]});
  assert.equal(view.products[0].displayPrice, 'Q 12.50');
  assert.equal(view.inventoryValue, 'Q 50.00');
  assert.equal(view.summary.totalStock, 4);
  assert.equal(view.library, '@tienda/shared');
});
test('frontend admite catálogo vacío', () => {
  assert.equal(catalogView({products: []}).inventoryValue, 'Q 0.00');
});

