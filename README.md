# Semana 04 — Estadio deportivo (Validación, Errores y Logging)

Cuarta semana de Express: le agrego validación real con Zod, un manejo de errores estructurado
(`AppError` + un error handler global) y logs profesionales con Winston + Morgan, sobre la misma
API de concesiones de las semanas anteriores.

## Mi dominio

Sigo con **Estadio deportivo** (`events`, `seats`, `tickets`, `concessions`). Esta semana el
recurso sigue siendo `ConcessionItem`: `id`, `name`, `description`, `price`, `type`, `stock`,
`available`, `createdAt`.

## Validación con Zod

`src/schemas/product.schema.ts` define `createProductSchema` con:
- `name` y `type`: obligatorios, con mensaje de error personalizado si faltan.
- `price`: obligatorio, debe ser mayor a 0 (`.positive()`).
- `stock`: entero, no puede ser negativo, por defecto `0`.
- `description`: opcional, por defecto `''`.
- `available`: opcional, por defecto `true`.

`updateProductSchema` reutiliza los mismos campos base con `.partial()`, pero **sin los
`.default()`** de creación — si el schema de update se derivara directo del de creación con
`.partial()`, un `PUT` que solo mande `{ stock: 80 }` terminaría reseteando `description` a `''`
y `available` a `true`, porque Zod sigue aplicando los defaults a los campos que faltan en el
body incluso después de `.partial()`. Lo comprobé con curl antes de arreglarlo. La solución fue
separar los campos base (sin default) de los defaults, que solo se agregan en
`createProductSchema`.

Los tipos `CreateProductDto`/`UpdateProductDto` se infieren directo del schema con `z.infer<>`,
así que el tipo y la validación nunca se desincronizan.

**Nota**: el starter del profe usaba `required_error` en los schemas, que es sintaxis de Zod v3 —
pero la versión pineada en este proyecto es Zod v4, donde ese parámetro ya no existe (ahora es
`{ error: '...' }`).

## Manejo de errores

- `AppError` (en `src/errors/`): una clase que extiende `Error`, con `statusCode` e
  `isOperational`, para lanzar errores de dominio como `throw new AppError(404, '...')` desde el
  service.
- `notFound`: middleware que captura cualquier ruta no registrada y la convierte en un
  `AppError(404, ...)`.
- `errorHandler`: el middleware final, con **4 parámetros exactos** (así Express sabe que es un
  error handler). Distingue tres casos:
  - `ZodError` → 400, con la lista de `issues`.
  - `AppError` → el `statusCode` que traiga, y se registra con `logger.warn()`.
  - Cualquier otro error → 500, con el stack trace solo visible fuera de producción.

## Logging con Winston + Morgan

`src/config/logger.ts`: nivel `http` en desarrollo (`warn` en producción), formato coloreado en
consola durante desarrollo y JSON en producción, con un archivo `logs/error.log` que solo se
activa en producción. Morgan usa la stream de Winston, así que las peticiones HTTP y los logs de
la app salen por el mismo canal — no hay ni un `console.log` en el proyecto.

## Endpoints

| Método | Ruta | Descripción | Status |
|--------|------|-------------|--------|
| GET | `/api/v1/concessions?page=1&limit=10` | Listar con paginación | 200 |
| GET | `/api/v1/concessions/:id` | Obtener por id | 200 / 400 / 404 |
| POST | `/api/v1/concessions` | Crear, validado con Zod | 201 / 400 |
| PUT | `/api/v1/concessions/:id` | Actualizar, validado con Zod | 200 / 400 / 404 |
| DELETE | `/api/v1/concessions/:id` | Eliminar | 204 / 400 / 404 |

## Cómo correrlo

```bash
pnpm install
cp .env.example .env
pnpm dev
```

## Cómo probarlo

```bash
# Body inválido → 400 con issues
curl -X POST http://localhost:3000/api/v1/concessions \
  -H "Content-Type: application/json" \
  -d '{ "price": -5 }'

# id no numérico → 400
curl http://localhost:3000/api/v1/concessions/abc

# id inexistente → 404
curl http://localhost:3000/api/v1/concessions/999

# ruta inexistente → 404 en JSON
curl http://localhost:3000/no-existe

# PUT parcial: solo actualiza el campo enviado, no borra el resto
curl -X PUT http://localhost:3000/api/v1/concessions/1 \
  -H "Content-Type: application/json" \
  -d '{ "stock": 80 }'
```

## Cómo verificar que compila

```bash
pnpm build
```

## Entregables de esta semana

- Schemas Zod para crear y actualizar, con tipos inferidos
- Validación activa en los controllers con `.safeParse()`
- `AppError` + error handler global de 4 parámetros
- Logging con Winston (sin `console.log`) + Morgan
- `pnpm build` sin errores de TypeScript
- Este README

La rúbrica de evaluación de esta semana está en el repo del bootcamp
([ergrato-dev/bc-expressjs](https://github.com/ergrato-dev/bc-expressjs)).
