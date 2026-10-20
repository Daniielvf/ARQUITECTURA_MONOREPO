# Arquitectura de Sistemas - HW-05

Monorepo de una tienda con dos aplicaciones y una libreria compartida, administrado con **Turborepo y npm workspaces**.

- Repositorio del curso: https://github.com/Daniielvf/ARQUITECTURA_MONOREPO
- Rama de evaluacion: [`hw-05`](https://github.com/Daniielvf/ARQUITECTURA_MONOREPO/tree/hw-05), creada desde `main` despues del commit inicial.

## Estructura

```text
apps/
  frontend/           # Interfaz web con JavaScript y Vite
    src/              # Consulta de API, presentacion y estilos
    test/             # Pruebas de transformacion del catalogo
  backend/            # API HTTP con Node.js
    src/              # Servidor y rutas
    test/             # Pruebas HTTP con un servidor real en puerto temporal
packages/
  shared/             # @tienda/shared: datos y utilidades reutilizables
    src/
    test/
docs/
  screenshots/        # Capturas reales de ambas aplicaciones funcionando
package.json          # Workspaces y comandos para todo el monorepo
package-lock.json     # Versiones reproducibles de las dependencias
turbo.json            # Dependencias entre tareas y cache
```

## Por que Turborepo

Se eligio Turborepo para compilar la libreria antes de las aplicaciones que la importan y ejecutar los comandos de los tres paquetes desde la raiz. Su cache permite reutilizar una compilacion cuando sus archivos no han cambiado.

npm workspaces instala y enlaza los paquetes locales. Las aplicaciones declaran `@tienda/shared` como dependencia. Turborepo reconoce esa relacion y compila primero la libreria mediante `dependsOn: ["^build"]`. Las salidas `dist/**` se almacenan en cache; los servidores de desarrollo son tareas persistentes sin cache.

## Ejecutar desde cero

Requisitos: Git, Node.js **22.12 o posterior** y npm **11.17.0**. Validado con Node.js 24.19.0 y npm 11.17.0.

```bash
git clone https://github.com/Daniielvf/ARQUITECTURA_MONOREPO.git
cd ARQUITECTURA_MONOREPO
git switch hw-05
npm ci
npm run dev
```

Abrir:

- Frontend: http://127.0.0.1:5173
- Backend (catalogo JSON): http://127.0.0.1:3001/api/products
- Estado del backend: http://127.0.0.1:3001/api/health

`npm run dev` compila primero la libreria y arranca ambas aplicaciones. Detener con `Ctrl+C`. Los puertos 5173 y 3001 deben estar libres.

Para ejecutar cada aplicacion por separado, usar dos terminales desde la raiz:

```bash
# Terminal 1
npm run dev:backend
```

```bash
# Terminal 2
npm run dev:frontend
```

El backend funciona de manera independiente. El frontend puede iniciar solo, pero necesita el backend para mostrar el catalogo; si no esta disponible, presenta un mensaje de error. Vite redirige `/api` al backend mediante un proxy.

Si se modifica `packages/shared/src/index.js` durante el desarrollo, detener los servidores y volver a ejecutar `npm run dev` para recompilar la libreria.

## Comandos desde la raiz

| Comando | Funcion |
| --- | --- |
| `npm ci` | Instalar todos los workspaces respetando el archivo de bloqueo |
| `npm install` | Instalar dependencias y actualizar el bloqueo al cambiar paquetes |
| `npm run dev` | Ejecutar frontend y backend en desarrollo |
| `npm run dev:frontend` | Ejecutar unicamente el frontend y compilar su dependencia compartida |
| `npm run dev:backend` | Ejecutar unicamente el backend y compilar su dependencia compartida |
| `npm run build` | Compilar la libreria y ambas aplicaciones |
| `npm run build:frontend` | Compilar frontend y libreria compartida |
| `npm run build:backend` | Compilar backend y libreria compartida |
| `npm test` | Ejecutar las pruebas de los tres paquetes |
| `npm run test:frontend` | Probar la transformacion de datos del frontend |
| `npm run test:backend` | Probar la API HTTP |
| `npm start` | Compilar y ejecutar las aplicaciones compiladas en vista previa local |

Para comprobar las compilaciones:

```bash
npm run build
npm test
npm start
```

Detener previamente los servidores de desarrollo: la vista previa utiliza los mismos puertos. `npm start` sirve para verificar el resultado localmente; el frontend usa `vite preview`.

## Libreria compartida

`packages/shared` exporta:

- `products`: catalogo de ejemplo.
- `formatPrice`: valida el precio y lo presenta en quetzales con dos decimales.
- `summarizeProducts`: calcula cantidad de productos, existencias y valor del inventario.
- `LIBRARY_NAME`: identifica el paquete en las evidencias.

El backend importa estas utilidades en `apps/backend/src/app.js`. `GET /api/products` devuelve los productos, los precios formateados y el resumen calculado.

El frontend importa las mismas utilidades en `apps/frontend/src/catalog.js` y vuelve a calcular los precios y el resumen a partir de los datos numericos de la API. Ambas aplicaciones declaran la dependencia en su propio `package.json`.

El catalogo contiene 3 productos y 65 unidades. El valor del inventario es **Q 1910.00**, calculado como precio por existencias de cada producto. Los datos se mantienen en memoria.

## Pruebas

Las cinco pruebas automatizadas usan `node:test`:

- Libreria: formato monetario, rechazo de precios invalidos y resumen de inventario, incluido el catalogo vacio.
- Backend: respuesta real de `/api/products`, datos calculados, estado de salud, ruta inexistente (404) y metodo no permitido (405).
- Frontend: calculo propio de precios y totales desde datos de la API y manejo de catalogo vacio.

## Capturas de pantalla

Ambas aplicaciones se iniciaron con `npm run dev` para tomar estas capturas.

### Frontend

El catalogo muestra los precios y el resumen calculados con `@tienda/shared`, ademas de la identificacion de la libreria utilizada por cada aplicacion.

![Frontend funcionando con la libreria compartida](docs/screenshots/frontend.jpg)

### Backend

Respuesta JSON de `http://127.0.0.1:3001/api/products`: incluye `sharedLibrary`, `formattedPrice` y `summary`, producidos usando la libreria compartida.

![Backend funcionando con la libreria compartida](docs/screenshots/backend.jpg)

## Historial de commits

Los mensajes siguen Conventional Commits: `tipo(alcance opcional): descripcion`. Por ejemplo, `feat(shared): add catalog utilities and unit tests`.

```bash
git log --oneline --all --graph
```

`main` conserva la base inicial; la implementacion de esta evaluacion se encuentra en `hw-05`.

## Referencias

- [Turborepo: configuracion de tareas](https://turborepo.com/docs/crafting-your-repository/configuring-tasks)
- [npm workspaces](https://docs.npmjs.com/cli/v11/using-npm/workspaces)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
