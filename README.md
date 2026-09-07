# Semana 07 — Estadio deportivo (Autenticación con JWT)

Séptima semana de Express: agrego autenticación completa (registro, login, `/me`, refresh con
rotación y logout) con **bcrypt** + **JWT access/refresh tokens en cookies HttpOnly**, y protejo
el CRUD de concesiones del estadio con `authMiddleware`.

## Mi dominio

Sigo con **Estadio deportivo**. El recurso principal protegido es `Concession` (producto de las
concesiones): `name`, `description`, `sku` (único), `price`, `stock`, `available`, y `createdBy`
(referencia al usuario que lo creó).

## Autenticación

- **`User`**: `email` (único), `password` (`select: false` — nunca se devuelve en queries),
  `name`, `role` (`user`/`admin`), `refreshToken` (`select: false`, se guarda **hasheado**).
- **Registro**: `bcrypt.hash()` con 10 salt rounds antes de guardar la contraseña.
- **Login**: `bcrypt.compare()` contra el hash. Si el email no existe **o** la contraseña no
  coincide, se responde exactamente el mismo mensaje ("Credenciales inválidas") — evita que un
  atacante pueda enumerar qué emails están registrados.
- **Access token**: expira en 15 minutos, firmado con `JWT_ACCESS_SECRET`.
- **Refresh token**: expira en 7 días, firmado con `JWT_REFRESH_SECRET` (un secreto **distinto**
  al del access token). Se guarda **hasheado** en el usuario (nunca en texto plano).
- **Cookies**: ambos tokens van en cookies `httpOnly`, `sameSite: 'lax'`, `secure` en producción.
  El `refreshToken` está además scopeado a `/api/v1/auth` (el navegador no lo manda a ninguna otra ruta).
- **`POST /auth/refresh`**: verifica el refresh token, compara su hash contra el guardado, y si
  coincide **rota** ambos tokens (invalida el refresh anterior guardando un hash nuevo).
- **`POST /auth/logout`**: limpia ambas cookies y pone `refreshToken: null` en la base de datos —
  probé con curl que reusar el refresh token viejo después de logout ya da 401.

## El recurso protegido

Las 5 rutas de `/api/v1/concessions` pasan por `authMiddleware` (verifica el `accessToken` de la
cookie). Sin cookie válida, cualquier operación responde 401 antes de llegar al controller.

## Un bug real que encontré en el starter

El `errorHandler.ts` que trae el starter (código "dado", no TODO) solo distingue `AppError` del
resto — pero tanto `auth.controller.ts` (dado) como mi `concession.controller.ts` validan el body
con `schema.parse()` (no `safeParse`), que **lanza** un `ZodError` cuando el body es inválido. Sin
un caso para `ZodError`, ese error caía al branch genérico y respondía **500** en vez de 400 —
lo comprobé registrando un usuario con contraseña débil antes de arreglarlo. Le agregué el `if
(err instanceof ZodError)` al inicio del handler para que devuelva 400 con el detalle de los
campos inválidos, igual que en semanas anteriores.

También encontré (otra vez) que `tsconfig.json` traía `declaration: true` sin que `app`/`router`
tuvieran tipo explícito, lo que hace que TypeScript no pueda "nombrar" su tipo inferido de forma
portable a través de pnpm — hubo que anotar `const app: Express` y `const router: Router`
explícitamente para que `pnpm build` compilara.

## Endpoints

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/v1/auth/register` | Registro | Pública |
| POST | `/api/v1/auth/login` | Login, emite cookies | Pública |
| GET | `/api/v1/auth/me` | Perfil del usuario | 🔒 |
| POST | `/api/v1/auth/refresh` | Renueva tokens (rotación) | Pública (usa refreshToken) |
| POST | `/api/v1/auth/logout` | Cierra sesión | 🔒 |
| GET | `/api/v1/concessions` | Listar | 🔒 |
| GET | `/api/v1/concessions/:id` | Detalle | 🔒 |
| POST | `/api/v1/concessions` | Crear | 🔒 |
| PATCH | `/api/v1/concessions/:id` | Actualizar parcial | 🔒 |
| DELETE | `/api/v1/concessions/:id` | Eliminar | 🔒 |

## Cómo correrlo

```bash
docker compose up -d
pnpm install
cp .env.example .env   # genera tus propios secretos: openssl rand -base64 64
pnpm dev
```

## Cómo probarlo

```bash
BASE=http://localhost:3000/api/v1
JAR=cookies.txt

# registro
curl -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{ "email": "admin@estadio.com", "password": "Admin1234", "name": "Admin" }'

# login — guarda las cookies HttpOnly
curl -c "$JAR" -X POST "$BASE/auth/login" -H "Content-Type: application/json" \
  -d '{ "email": "admin@estadio.com", "password": "Admin1234" }'

# ruta protegida sin cookie -> 401
curl "$BASE/concessions"

# ruta protegida con cookie
curl -b "$JAR" "$BASE/concessions"

# crear una concesión
curl -b "$JAR" -X POST "$BASE/concessions" -H "Content-Type: application/json" \
  -d '{ "name": "Papas Criollas", "description": "...", "sku": "SNK-001", "price": 3000 }'

# renovar tokens
curl -b "$JAR" -c "$JAR" -X POST "$BASE/auth/refresh"

# cerrar sesión
curl -b "$JAR" -c "$JAR" -X POST "$BASE/auth/logout"
```

## Cómo verificar que compila

```bash
pnpm build
```

## Entregables de esta semana

- Registro/login con `bcrypt` (10 salt rounds) y mismo mensaje de error para email/contraseña
- Access token (15 min) + refresh token (7 días) con secretos distintos
- Ambos tokens en cookies `httpOnly` / `sameSite` / `secure` en producción
- `authMiddleware` protegiendo las 5 rutas de `concessions`
- `/auth/refresh` con rotación real (verificado con curl)
- `/auth/logout` invalida el refresh token en base de datos (verificado con curl)
- Secretos JWT solo en `.env`, nunca hardcodeados
- `pnpm build` sin errores de TypeScript
- Este README

La rúbrica de evaluación de esta semana está en el repo del bootcamp
([ergrato-dev/bc-expressjs](https://github.com/ergrato-dev/bc-expressjs)).
