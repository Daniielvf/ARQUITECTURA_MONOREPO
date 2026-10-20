import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';
test('API entrega catálogo calculado con librería compartida y errores HTTP', async () => {
  const server = createApp();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    const base = 'http://127.0.0.1:' + server.address().port;
    const response = await fetch(base + '/api/products');
    assert.equal(response.status, 200);
    const data = await response.json();
    assert.equal(data.sharedLibrary, '@tienda/shared');
    assert.equal(data.products[0].formattedPrice, 'Q 25.00');
    assert.deepEqual(data.summary, {productCount: 3, totalStock: 65, inventoryValue: 1910});
    assert.equal((await fetch(base + '/missing')).status, 404);
    assert.equal((await fetch(base + '/api/products', {method: 'POST'})).status, 405);
    assert.equal((await (await fetch(base + '/api/health')).json()).status, 'ok');
  } finally { await new Promise(resolve => server.close(resolve)); }
});

