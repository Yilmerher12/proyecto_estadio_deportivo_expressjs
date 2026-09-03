# Semana 06 — Estadio deportivo (MongoDB + Mongoose)

Sexta semana de Express: migro la API de concesiones de PostgreSQL/Prisma (semana 05) a
**MongoDB con Mongoose**, con dos entidades relacionadas por `ObjectId` + `populate()`,
paginación, y manejo de los errores propios de Mongo (`CastError`, índice único `11000`).

## Mi dominio

Sigo con **Estadio deportivo** (`events`, `seats`, `tickets`, `concessions`):

- **`Category`** (entidad secundaria, sin referencias) — categoría de producto: Bebidas, Comida, Snacks.
- **`Concession`** (entidad principal) — producto vendido en las concesiones, con referencia a `Category`.

### Relación

```
Category (secundaria)  ──── referenciada por ObjectId ────>  Concession (principal)
  name (unique)                                                name
  description                                                  description
                                                                 sku (unique)
                                                                 price
                                                                 stock
                                                                 available
                                                                 category: ObjectId, ref: 'Category'
```

### Campos de `Concession`

| Campo | Tipo | Validación |
|-------|------|-----------|
| `name` | `String` | requerido, trim, max 150 |
| `description` | `String` | requerido, trim, max 500 |
| `sku` | `String` | requerido, único, uppercase, trim |
| `price` | `Number` | requerido, mínimo 0 |
| `stock` | `Number` | mínimo 0, default 0 |
| `available` | `Boolean` | default `true` |
| `category` | `ObjectId` | requerido, `ref: 'Category'` |
| `createdAt` / `updatedAt` | `Date` | automáticos (`timestamps: true`) |

## Validación con Zod

`src/schemas/concession.schema.ts` valida los 6+ campos, incluyendo `category` como ObjectId
(regex de 24 caracteres hexadecimales). Igual que en semana 04/05: `updateConcessionSchema` se
arma con los campos base **sin `.default()`**, para que un `PUT` parcial no resetee `stock` ni
`available` a sus valores por defecto cuando no se envían.

## Manejo de errores de Mongo

- **`CastError`** (id con formato inválido) → `AppError(400, 'ID inválido')`, capturado en el repository.
- **Código `11000`** (índice único duplicado, ej. `sku` repetido) → `AppError(409, ...)`, usando `err.keyPattern` para armar el mensaje con el campo real.
- **`findById` retorna `null`** → `AppError(404, ...)` desde el repository.
- **Categoría inexistente al crear/actualizar una concesión**: Mongo no tiene *foreign keys*, así que un `ObjectId` con formato válido pero que no existe en la colección `categories` **no falla solo** — lo comprobé con curl: un `POST` con una categoría inexistente creaba la concesión igual (201), con el `category` quedando huérfano. Lo corregí agregando una verificación explícita en `concession.service.ts` (`categoryRepo.exists(dto.category)`) antes de crear o actualizar, devolviendo `AppError(400, 'La categoría especificada no existe')`.

## Endpoints

| Método | Ruta | Descripción | Status |
|--------|------|-------------|--------|
| GET | `/api/v1/categories` | Listar categorías | 200 |
| GET/POST/PUT/DELETE | `/api/v1/categories/:id` | CRUD de categorías | 200/201/204/400/404/409 |
| GET | `/api/v1/concessions?page=1&limit=10&search=` | Listado paginado, con `category` poblada | 200 |
| GET | `/api/v1/concessions/:id` | Detalle con `category` poblada | 200/400/404 |
| POST | `/api/v1/concessions` | Crear, valida Zod + existencia de la categoría | 201/400/409 |
| PUT | `/api/v1/concessions/:id` | Actualizar (parcial) | 200/400/404/409 |
| DELETE | `/api/v1/concessions/:id` | Eliminar | 204/400/404 |

## Cómo correrlo

```bash
docker compose up -d           # levanta MongoDB
pnpm install
cp .env.example .env           # ajusta el puerto si 3000 o 27017 ya están en uso
pnpm seed
pnpm dev
```

### Log del seed

```
MongoDB connected
Collections cleared
Categories inserted
Concessions inserted
Seed completed successfully
```

## Cómo probarlo

```bash
BASE=http://localhost:3000/api/v1

# listado paginado con category poblada
curl "$BASE/concessions?page=1&limit=5"

# crear (usa un _id real de /categories)
curl -X POST "$BASE/concessions" -H "Content-Type: application/json" \
  -d '{ "name": "Papas Criollas", "description": "...", "sku": "SNK-999", "price": 3000, "category": "<objectId>" }'

# sku duplicado -> 409
curl -X POST "$BASE/concessions" -H "Content-Type: application/json" \
  -d '{ "name": "dup", "description": "...", "sku": "SNK-999", "price": 1000, "category": "<objectId>" }'

# categoría inexistente (ObjectId válido) -> 400
curl -X POST "$BASE/concessions" -H "Content-Type: application/json" \
  -d '{ "name": "x", "description": "...", "sku": "SNK-000", "price": 1, "category": "000000000000000000000000" }'

# id con formato inválido -> 400 (CastError)
curl "$BASE/concessions/abc"

# ruta inexistente -> 404
curl http://localhost:3000/no-existe
```

## Cómo verificar que compila

```bash
pnpm build
```

## Bugs del starter que encontré y corregí

- `server.ts` y `seed.ts` importan `'dotenv/config'`, pero `dotenv` no estaba en las dependencias del `package.json` del starter — lo agregué.
- Los repositories importan `MongoServerError` desde `'mongodb'`, pero ese paquete no aparecía como dependencia directa (solo transitivo vía `mongoose`, y con pnpm eso no se resuelve) — lo agregué explícitamente.
- `FilterQuery`, el tipo que sugiere el hint del starter para el filtro de búsqueda, ya no existe como export público en Mongoose 9.x — usé un tipo genérico en su lugar.

## Entregables de esta semana

- `Category` (secundaria) y `Concession` (principal) con relación por `ObjectId` + `populate()`
- Paginación con `skip`/`limit` + `countDocuments()`
- `CastError` → 400, `11000` → 409, no encontrado → 404, categoría inexistente → 400
- Seed idempotente con 3 categorías y 10 concesiones
- `MONGODB_URI` solo por variable de entorno
- `pnpm build` sin errores de TypeScript
- Este README

La rúbrica de evaluación de esta semana está en el repo del bootcamp
([ergrato-dev/bc-expressjs](https://github.com/ergrato-dev/bc-expressjs)).
