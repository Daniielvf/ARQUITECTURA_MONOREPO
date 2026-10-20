import { catalogView } from './catalog.js';
import './style.css';
const app = document.querySelector('#app');
app.innerHTML = '<p class="eyebrow">ARQUITECTURA DE SISTEMAS · HW-05</p><h1>Catálogo de tienda</h1><p id="status" role="status">Cargando productos del backend…</p>';
async function loadCatalog() {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const view = catalogView(await response.json());
    document.querySelector('#status').textContent = 'Frontend conectado al backend · Catálogo disponible';
    const summary = document.createElement('section');
    summary.className = 'summary';
    for (const text of [view.summary.productCount + ' productos', view.summary.totalStock + ' unidades', view.inventoryValue + ' en inventario']) {
      const item = document.createElement('strong'); item.textContent = text; summary.append(item);
    }
    app.append(summary);
    const grid = document.createElement('section'); grid.className = 'grid';
    for (const product of view.products) {
      const card = document.createElement('article');
      for (const [tag, text] of [['span', 'PRODUCTO ' + String(product.id).padStart(2, '0')], ['h2', product.name], ['p', product.displayPrice], ['small', product.stock + ' unidades disponibles']]) {
        const element = document.createElement(tag); element.textContent = text; card.append(element);
      }
      grid.append(card);
    }
    app.append(grid);
    const evidence = document.createElement('section'); evidence.className = 'evidence';
    const title = document.createElement('h2'); title.textContent = 'Librería compartida en uso';
    const detail = document.createElement('p');
    detail.textContent = 'Frontend: ' + view.library + ' · Backend: ' + view.backendLibrary;
    const explanation = document.createElement('p');
    explanation.textContent = 'Ambas aplicaciones importan formatPrice y summarizeProducts. El frontend calcula estos precios y totales a partir de los datos recibidos por la API.';
    const link = document.createElement('a'); link.href = 'http://127.0.0.1:3001/api/products'; link.textContent = 'Ver respuesta del backend →';
    evidence.append(title, detail, explanation, link); app.append(evidence);
  } catch {
    document.querySelector('#status').textContent = 'No se pudo cargar el catálogo. Verifica que el backend esté activo en el puerto 3001 y recarga la página.';
  }
}
loadCatalog();

