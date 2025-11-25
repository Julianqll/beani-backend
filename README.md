## Beani IoT Backend

Backend NestJS + Prisma + PostgreSQL para monitorear y analizar lecturas de cultivo de soya. Está pensado para tres clientes: el ESP8266 que envía lecturas, un dashboard en React y un módulo de IA (Gemini/MCP).

### Stack

- NestJS 11 con arquitectura modular (`devices`, `readings`, `ai`, `prisma`)
- Prisma ORM + PostgreSQL
- Configuración centralizada con `@nestjs/config` + Joi
- Swagger disponible en `/api/docs`
- Validaciones `class-validator` y protección opcional vía `x-api-key`

## Requisitos

- Node.js 20+
- PostgreSQL 15+ (puedes usar el `docker-compose.yml` incluido)

```bash
# Levantar Postgres con Docker
docker compose up -d

# Instalar dependencias
npm install

# Copiar variables de entorno
cp env.example .env
```

Variables necesarias:

| Nombre | Descripción |
| --- | --- |
| `DATABASE_URL` | Cadena de conexión de PostgreSQL |
| `PORT` | Puerto HTTP (default 3000) |
| `API_KEY_ESP8266` | Clave para el ESP8266 (opcional) |
| `FRONTEND_URL` | Origin permitido para CORS |

## Prisma

```bash
# Crear migraciones (dev)
npm run prisma:migrate -- --name init

# Generar cliente
npm run prisma:generate

# Seed de dispositivos demo
npm run seed
```

## Ejecutar

```bash
npm run start:dev   # desarrollo
npm run start:prod  # producción
```

## Testing

```bash
npm run test        # unit tests
npm run test:e2e    # e2e básicos
```

## Endpoints clave

- `POST /api/lecturas` — ingestión desde ESP8266 (usa `x-api-key`)
- `GET /api/lecturas/recientes` — últimas lecturas para dashboard
- `GET /api/lecturas/historico?fecha=YYYY-MM-DD`
- `GET /api/lecturas/rango?desde&hasta`
- `POST /api/devices` / `GET /api/devices`
- `GET /api/ia/lecturas` — datos listos para MCP / Gemini
- `GET /api/ia/reporte-diario` — resumen min/max/prom
- Swagger con descripción completa en `http://localhost:3000/api/docs`

## Arquitectura rápida

- `src/prisma` expone `PrismaService` global
- `src/common` contiene filtros de excepciones y guard de API Key
- `devices` maneja registro/listado de nodos IoT
- `readings` recibe, valida y consulta lecturas
- `ai` entrega formatos amigables para IA y reportes analíticos

## IA / MCP

Los endpoints del módulo `ai` están listos para mapearse como tools MCP:

- `GET /api/ia/lecturas` → `get_readings` / `analyze_trends`
- `GET /api/ia/reporte-diario` → `generate_report` / `recommend_irrigation`

Cada respuesta incluye estadísticas y datos normalizados para integraciones posteriores con Gemini.
