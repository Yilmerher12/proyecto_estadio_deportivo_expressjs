# Semana 03 — Estadio deportivo (API REST con arquitectura en capas)

Proyecto de la semana 3 del bootcamp `bc-expressjs`: la misma API de concesiones del estadio,
pero esta vez refactorizada en arquitectura de 4 capas (`routes → controllers → services →
repositories`), con contratos de respuesta tipados en TypeScript.

## Mi dominio

**Estadio deportivo** (`events`, `seats`, `tickets`, `concessions`). Esta semana el recurso es
`ConcessionItem`: `id`, `name`, `description`, `type`, `price`, `stock`, `available`, `createdAt`.

## Arquitectura

- **`src/repositories/concessions.repository.ts`** — único punto de acceso al store en memoria.
  Todos los métodos `async`, devuelven copias defensivas (nunca la referencia interna), y
  `undefined`/`false` cuando no encuentran nada.
- **`src/services/concessions.service.ts`** — la lógica de negocio: paginación en `findAll`,
  verifica existencia antes de actualizar/eliminar. Sin ningún import de Express.
- **`src/controllers/concessions.controller.ts`** — controllers "delgados": extraer datos del
  request → llamar al service → responder. Los 404 se arman aquí cuando el service devuelve
  `undefined`, y todo pasa por `try/catch` hacia `next(err)`.
- **`src/routes/concessions.routes.ts`** — solo mapea URL + método HTTP a la función del
  controller correspondiente.
- **`src/types.ts`** — `ConcessionItem`, `CreateConcessionDto` / `UpdateConcessionDto`, y los
  contratos de respuesta (`SingleResponse`, `PaginatedResponse`, `ErrorResponse`).

## Endpoints

| Método | Ruta | Descripción | Status |
|--------|------|-------------|--------|
| GET | `/api/v1/concessions?page&limit` | Listar paginado | 200 |
| GET | `/api/v1/concessions/:id` | Obtener por id | 200 / 404 |
| POST | `/api/v1/concessions` | Crear producto | 201 |
| PUT | `/api/v1/concessions/:id` | Actualizar producto | 200 / 404 |
| DELETE | `/api/v1/concessions/:id` | Eliminar producto | 204 / 404 |

### Contratos de respuesta

```json
// GET /concessions?page=1&limit=5 → 200
{ "data": [...], "total": 4, "page": 1, "limit": 5 }

// GET /concessions/1 → 200
{ "data": { "id": 1, "name": "Coke", ... } }

// POST /concessions → 201
{ "data": { "id": 5, "name": "Papas Criollas", ..., "createdAt": "..." } }

// GET /concessions/999 → 404
{ "error": "Not Found", "message": "Product 999 not found" }
```

## Cómo correrlo

```bash
pnpm install
cp .env.example .env
pnpm dev
```

## Cómo probarlo con curl

```bash
curl "http://localhost:3000/api/v1/concessions?page=1&limit=10"

curl -X POST http://localhost:3000/api/v1/concessions \
  -H "Content-Type: application/json" \
  -d '{ "name": "Papas Criollas", "description": "Fried golden potatoes", "type": "snack", "price": 3000, "stock": 40, "available": true }'

curl http://localhost:3000/api/v1/concessions/1

curl -X PUT http://localhost:3000/api/v1/concessions/1 \
  -H "Content-Type: application/json" \
  -d '{ "stock": 75 }'

curl -X DELETE http://localhost:3000/api/v1/concessions/2
```

## Cómo verificar que compila

```bash
pnpm build
```

## Entregables de esta semana

- Arquitectura en 4 capas separada físicamente (`routes`, `controllers`, `services`, `repositories`)
- Los 5 endpoints CRUD implementados sobre `/api/v1/concessions`
- Contratos de respuesta consistentes (`data` wrapper, `total`/`page`/`limit` en el listado, `error`/`message` en 404)
- DTOs tipados (`CreateConcessionDto`, `UpdateConcessionDto`) sin uso de `any`
- `pnpm build` sin errores de TypeScript
- Este README con la descripción del dominio y la arquitectura

La rúbrica de evaluación de esta semana está en el repo del bootcamp
([ergrato-dev/bc-expressjs](https://github.com/ergrato-dev/bc-expressjs)).
