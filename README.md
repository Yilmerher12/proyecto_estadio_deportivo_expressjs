# Semana 05 — Estadio deportivo (PostgreSQL + Prisma ORM)

Quinta semana de Express: migro la API de concesiones del almacenamiento en memoria a
**PostgreSQL** con **Prisma ORM**, con migraciones versionadas, seed de datos y manejo de
errores propios de una base de datos real (constraints únicos, registros no encontrados).

## Mi dominio

Sigo con **Estadio deportivo** (`events`, `seats`, `tickets`, `concessions`). Esta semana
modelo la relación completa de las concesiones:

- **`Category`** (recurso secundario) — categoría de producto: Bebidas, Comida, Snacks.
- **`Concession`** (recurso principal) — producto vendido en las concesiones, con relación N:1 a
  `Category`.

### Diagrama de la relación

```
Category (1) ──────< (N) Concession
  id (uuid, PK)          id (uuid, PK)
  name (unique)          name
  description            description
                          sku (unique)
                          price
                          stock
                          available
                          categoryId (FK -> Category.id)
```

### Campos de `Concession`

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | `String @id @default(uuid()) @db.Uuid` | PK |
| `name` | `String` | obligatorio |
| `description` | `String` | obligatorio |
| `sku` | `String @unique` | obligatorio — dispara `P2002` si se repite |
| `price` | `Float` | debe ser > 0 |
| `stock` | `Int @default(0)` | no negativo |
| `available` | `Boolean @default(true)` | |
| `categoryId` | `String @db.Uuid` | FK a `Category` |
| `createdAt` / `updatedAt` | `DateTime` | timestamps automáticos |

## Validación con Zod

`src/schemas/concessions.schema.ts`: `createConcessionSchema` valida todos los campos
(incluyendo `categoryId` como UUID). `updateConcessionSchema` se arma con los mismos campos base
**sin los `.default()`** — la misma lección de la semana 04: si `updateSchema` se derivara con
`.partial()` directo del schema de creación, un `PUT` que solo mande `{ stock: 80 }` terminaría
reseteando `stock`/`available` a sus valores por defecto en vez de dejarlos intactos. Lo probé de
nuevo con curl (`PUT` solo con `stock`) y confirmé que `name`/`description`/`price` no se tocan.

## Prisma

- **Singleton** en `src/lib/prisma.ts` con el patrón `globalForPrisma`, para no crear una
  instancia nueva de `PrismaClient` en cada hot-reload de `tsx watch`.
- **Repositorio** (`src/repositories/concessions.repository.ts`) es la única capa que importa
  `prisma`. `findAll` usa `Promise.all([findMany, count])` con `skip`/`take` para paginar, e
  `include: { category: true }` para traer la relación sin N+1.
- **Errores de Prisma → `AppError`**:
  - `P2002` (constraint único, ej. `sku` repetido) → `AppError(409, ...)`.
  - `P2025` (registro no encontrado en `update`/`delete`) → `AppError(404, ...)`.
- `AppError` + `errorHandler` son los mismos de la semana 04 (clase con `statusCode` +
  `isOperational`, handler de 4 parámetros que distingue `ZodError` → 400, `AppError` → su
  status, y genérico → 500 con stack solo fuera de producción).

## Endpoints

| Método | Ruta | Descripción | Status |
|--------|------|-------------|--------|
| GET | `/api/v1/concessions?page=1&limit=10` | Listado paginado, con `category` incluida | 200 |
| GET | `/api/v1/concessions/:id` | Detalle con `category` incluida | 200 / 400 / 404 |
| POST | `/api/v1/concessions` | Crear, validado con Zod | 201 / 400 / 409 |
| PUT | `/api/v1/concessions/:id` | Actualizar (parcial) | 200 / 400 / 404 / 409 |
| DELETE | `/api/v1/concessions/:id` | Eliminar | 204 / 400 / 404 |

## Cómo correrlo

```bash
docker compose up -d          # levanta Postgres
pnpm install
cp .env.example .env          # ajusta el puerto si 3000 o 5432 ya están en uso
pnpm dlx prisma migrate dev --name init
pnpm dlx prisma db seed
pnpm dev
```

### Log del seed

```
🌱 Iniciando seed...
✅ 10 concesiones creadas en 3 categorías
```

## Cómo probarlo

```bash
BASE=http://localhost:3000/api/v1/concessions

# listado paginado con relación incluida
curl "$BASE?page=1&limit=5"

# crear (reemplaza categoryId por un id real de tu seed)
curl -X POST "$BASE" -H "Content-Type: application/json" \
  -d '{ "name": "Papas Criollas", "description": "...", "sku": "SNK-999", "price": 3000, "categoryId": "<uuid>" }'

# sku duplicado -> 409 (P2002)
curl -X POST "$BASE" -H "Content-Type: application/json" \
  -d '{ "name": "dup", "description": "...", "sku": "SNK-999", "price": 1000, "categoryId": "<uuid>" }'

# id inexistente -> 404 (P2025)
curl -X PUT "$BASE/00000000-0000-0000-0000-000000000000" -H "Content-Type: application/json" -d '{"stock":1}'

# ruta inexistente -> 404 en JSON
curl http://localhost:3000/no-existe
```

## Cómo verificar que compila

```bash
pnpm build
```

## Entregables de esta semana

- `prisma/schema.prisma` con `Category` (1) → `Concession` (N), PKs/FKs en UUID
- `prisma/migrations/` versionada y commiteada
- `prisma/seed.ts` idempotente con 10 registros en 3 categorías
- Singleton de Prisma en `src/lib/prisma.ts`
- Paginación con `skip`/`take`, relación con `include` (sin N+1)
- `P2002` → 409, `P2025` → 404, todo vía `AppError` + `errorHandler`
- Tipos derivados de Prisma Client (`Concession`, `Prisma.ConcessionGetPayload<...>`), sin
  interfaces duplicadas
- `DATABASE_URL` solo por variable de entorno, nunca hardcodeada
- `pnpm build` sin errores de TypeScript
- Este README

La rúbrica de evaluación de esta semana está en el repo del bootcamp
([ergrato-dev/bc-expressjs](https://github.com/ergrato-dev/bc-expressjs)).
