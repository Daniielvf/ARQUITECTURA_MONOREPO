export const LIBRARY_NAME = '@tienda/shared';
export const products = [
  { id: 1, name: 'Cuaderno', price: 25, stock: 18 },
  { id: 2, name: 'Mochila', price: 180, stock: 7 },
  { id: 3, name: 'Lapicero', price: 5, stock: 40 }
];
export function formatPrice(value) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new TypeError('El precio debe ser un número no negativo.');
  }
  return 'Q ' + value.toFixed(2);
}
export function summarizeProducts(items) {
  return {
    productCount: items.length,
    totalStock: items.reduce((total, item) => total + item.stock, 0),
    inventoryValue: items.reduce((total, item) => total + item.price * item.stock, 0)
  };
}

