import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatPrice, summarizeProducts } from '../src/index.js';
test('formatea quetzales y rechaza precios inválidos', () => {
  assert.equal(formatPrice(25), 'Q 25.00');
  assert.equal(formatPrice(0), 'Q 0.00');
  for (const value of [-1, NaN, Infinity, '25']) assert.throws(() => formatPrice(value), TypeError);
});
test('calcula existencias y valor de inventario', () => {
  assert.deepEqual(summarizeProducts([{price: 10, stock: 3}, {price: 5, stock: 2}]),
    {productCount: 2, totalStock: 5, inventoryValue: 40});
  assert.deepEqual(summarizeProducts([]), {productCount: 0, totalStock: 0, inventoryValue: 0});
});

