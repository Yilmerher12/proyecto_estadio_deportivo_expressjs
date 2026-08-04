# Semana 02 — Estadio deportivo (Express 5 + TypeScript)

Este es mi proyecto de la semana 2 del bootcamp bc-expressjs: una API REST con CRUD completo
sobre el catálogo de concesiones que ofrece un estado deportivo como comida, mercancia, bebidas, etc,
usando Express 5 y TypeScript, sin base de datos todavía — todo vive en un array en memoria considerado una mock databse.

La semana era sobre Express en sí: middlewares, rutas, códigos de estado HTTP y el ciclo
request/response, así que el proyecto es una API bien básica pero completa: los 5 endpoints
CRUD sobre `products`, con validación mínima y manejo de errores.

## Mi dominio

Sigo con **Estadio deportivo** (`events`, `seats`, `tickets`, `concessions`). Esta
semana el recurso es `Product`: `id`, `name`, `description`,`price`, `type`, `stock`, `available`.

## Qué hice

- `src/types.ts`: interfaz `ConcessionItem` + `CreateItemDto` / `UpdateItemDto`.
- `src/store.ts`: store en memoria con `getAll`, `getById`, `create`, `update`, `remove`,
  precargado con 4 products basicos y generales encontrados en estadios deportivos.
- `src/routes/products.routes.ts`: los 5 endpoints CRUD, con validación básica en `POST`
  (exige `name`, `price` y `type`) y 404 cuando el id no existe.
- `src/app.ts`: `express.json()`, un logger que imprime método/ruta/status/duración, un
  `/health`, las rutas de `products`, un handler 404 para rutas no encontradas y un error
  handler global al final.
- `src/server.ts`: arranca el servidor y cierra limpio con `SIGTERM`/`SIGINT`.

## Endpoints

| Método | Ruta | Descripción | Status |
|--------|------|-------------|--------|
| GET | `/api/v1/items` | Listar todos los producto/items | 200 |
| GET | `/api/v1/items/:id` | Obtener un producto/item por id | 200 / 404 |
| POST | `/api/v1/items` | Crear un producto/item | 201 / 400 |
| PUT | `/api/v1/items/:id` | Actualizar un producto/item | 200 / 404 |
| DELETE | `/api/v1/items/:id` | Eliminar un producto/item | 204 / 404 |

## Cómo correrlo

```bash
pnpm install
cp .env.example .env
pnpm dev
```

## Cómo probarlo con curl

```bash
curl http://localhost:3000/api/v1/items

curl -X POST http://localhost:3000/api/v1/items \
  -H "Content-Type: application/json" \
  -d '{ "name": "Millonarios FC shirt", "description": "Millonarios FC jersey for 2024/2025 season", "type": "clothes", "price": 200000, "stock": 23, "available": true }'

curl http://localhost:3000/api/v1/items/1

curl -X PUT http://localhost:3000/api/v1/items/4 \
  -H "Content-Type: application/json" \
  -d '{ "price": 33000 }'

curl -X DELETE http://localhost:3000/api/v1/items/1
```

## Cómo verificar que compila

```bash
pnpm build
```

## Entregables de esta semana

- Servidor funcional (`pnpm dev` levanta en `localhost:3000`)
- Los 5 endpoints CRUD implementados
- Validación básica en `POST`/`PUT`
- Middlewares: `express.json()`, logger, 404 handler, error handler
- `pnpm build` sin errores de TypeScript
- Este README con la descripción del dominio

La rúbrica de evaluación de esta semana está en el repo del bootcamp
([ergrato-dev/bc-expressjs](https://github.com/ergrato-dev/bc-expressjs)).