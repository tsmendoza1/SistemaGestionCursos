# Sistema de Gestión de Cursos

Sistema full-stack para la gestión de cursos académicos con backend en Node.js/Express y frontend en React.

## Tecnologías Utilizadas

### Backend
- **Node.js** con **Express**
- **TypeScript**
- **PostgreSQL** (sin ORM, queries directas con pg)
- **Jest** para testing
- **Supertest** para tests de integración

### Frontend
- **React** con **TypeScript**
- **Vite** como build tool
- **Axios** para peticiones HTTP
- **CSS** para estilos

## Requisitos Previos

- Node.js (v18 o superior)
- PostgreSQL (v14 o superior)
- npm o yarn

## Configuración del Proyecto

### 1. Configurar Base de Datos

1. Crear la base de datos PostgreSQL:
```bash
createdb cursos_db
```

2. Configurar la variable de entorno en `backend/.env`:
```env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/cursos_db
PORT=3001
```

3. Inicializar la base de datos con el script SQL:
```bash
cd backend
psql -d cursos_db -f scripts/init.sql
```

O en Windows:
```bash
psql -U postgres -d cursos_db -f scripts/init.sql
```

### 2. Instalar Dependencias del Backend

```bash
cd backend
npm install
```

### 3. Instalar Dependencias del Frontend

```bash
cd frontend
npm install
```

### Licencia

ISC

---

## 🚀 Despliegue en Producción

### Render (Backend + PostgreSQL)

1. **Crear base de datos PostgreSQL en Render**
2. **Crear Web Service en Render**:
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Variables de entorno:
     - `DATABASE_URL`: Internal Database URL de Render
     - `NODE_ENV`: `production`
     - `PORT`: `3001`

### Vercel (Frontend)

1. **Importar proyecto desde GitHub**
2. **Configurar**:
   - Root Directory: `frontend`
   - Framework: Next.js
   - Variable de entorno:
     - `NEXT_PUBLIC_API_URL`: URL del backend en Render

Ver guía completa de despliegue en la documentación del proyecto.

## Scripts Disponibles

### Backend

```bash
# Modo desarrollo
npm run dev

# Compilar TypeScript
npm run build

# Ejecutar en producción
npm run start

# Ejecutar tests
npm run test

# Tests en modo watch
npm run test:watch

# Inicializar base de datos
npm run init-db
```

### Frontend

```bash
# Modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Preview de producción
npm run preview
```

## Estructura del Proyecto

```
ExamenIngenieriaWeb/
├── backend/
│   ├── src/
│   │   ├── __tests__/
│   │   │   └── cursos.test.ts
│   │   ├── middleware/
│   │   │   └── monitoring.ts
│   │   ├── routes/
│   │   │   └── cursos.ts
│   │   ├── db.ts
│   │   └── index.ts
│   ├── scripts/
│   │   └── init.sql
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
└── README.md
```

## API Endpoints

### Cursos

- `GET /cursos` - Listar todos los cursos (opcional: `?area=nombre_area`)
- `GET /cursos/:id` - Obtener un curso por ID
- `GET /cursos/promedio-creditos` - Calcular promedio de créditos
- `POST /cursos` - Crear un nuevo curso
- `PUT /cursos/:id` - Actualizar un curso
- `DELETE /cursos/:id` - Eliminar un curso

### Health Check

- `GET /health` - Verificar estado del servidor

## Modelo de Datos

### Tabla: cursos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID autoincremental (PK) |
| nombre | VARCHAR(255) | Nombre del curso |
| descripcion | TEXT | Descripción del curso |
| creditos | INTEGER | Número de créditos |
| area | VARCHAR(100) | Área académica |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

## Testing

El proyecto incluye tests unitarios y de integración:

### Pruebas Unitarias

```bash
cd backend
npm test
```

O usando el script batch:
```bash
.\run-tests.bat
```

Los tests cubren:
- CRUD completo de cursos
- Filtrado por área
- Cálculo de promedio de créditos
- Manejo de errores
- Validación de datos

**Total: 13 tests** que validan todos los endpoints de la API.

### Pruebas de Estrés

El proyecto incluye un script de pruebas de estrés que ejecuta **2,600+ peticiones concurrentes**:

```bash
# Asegúrate de que el servidor esté corriendo primero
cd backend
npm run dev

# En otra terminal, ejecuta las pruebas de estrés
.\run-stress-tests.bat
```

O directamente:
```bash
cd backend
node stress-test.js
```

Las pruebas de estrés incluyen:
- 1,000 peticiones GET /cursos (50 concurrentes)
- 500 peticiones GET /cursos/promedio-creditos (50 concurrentes)
- 500 peticiones GET /cursos?area=Informática (50 concurrentes)
- 100 peticiones POST /cursos (10 concurrentes)
- 500 peticiones GET /cursos/:id (50 concurrentes)

**Métricas reportadas:**
- Total de peticiones exitosas/fallidas
- Tiempo total de ejecución
- Peticiones por segundo (throughput)
- Tiempos de respuesta (promedio, min, max, P50, P95, P99)

### Pruebas de Estrés con K6 + Grafana (Profesional)

Para pruebas de estrés con visualización en tiempo real:

**Requisitos:**
- K6 instalado: https://k6.io/docs/get-started/installation/
- Docker Desktop (para Grafana e InfluxDB)

**Iniciar infraestructura:**
```bash
docker-compose up -d
```

**Ejecutar pruebas:**
```bash
.\run-k6-tests.bat
```

O directamente:
```bash
# Modo básico (solo consola)
cd backend
k6 run k6-stress-test.js

# Modo Grafana (visualización en tiempo real)
k6 run --out influxdb=http://localhost:8086/k6 k6-stress-test.js
```

**Acceder a Grafana:**
- URL: http://localhost:3000
- Usuario: admin / Password: admin
- Importar dashboard ID: 2587 (K6 Load Testing Results)

**Configuración de la prueba:**
- Ramp-up: 0 → 100 usuarios en 3.5 minutos
- Carga sostenida: 100 usuarios por 1 minuto
- Ramp-down: 100 → 0 usuarios en 30 segundos
- Duración total: ~5 minutos
- Endpoints probados: GET, POST, filtros, health check

## Monitoreo

El backend incluye middleware de monitoreo que registra:
- Tiempo de respuesta de cada request
- Método HTTP y ruta
- Código de estado de respuesta
- Contador de peticiones totales
- Promedio de tiempo de respuesta
- Contador de errores

### Health Check Endpoint

Consulta el estado del servidor y métricas en tiempo real:

```bash
GET http://localhost:3001/health
```

Respuesta:
```json
{
  "status": "healthy",
  "uptime": 123.456,
  "timestamp": "2026-02-05T20:15:30.123Z",
  "metrics": {
    "requestCount": 150,
    "averageResponseTime": "12.34ms",
    "errors": 2
  }
}
```

## Desarrollo

### Ejecutar en modo desarrollo

1. Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

2. Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

El backend estará disponible en `http://localhost:3001`
El frontend estará disponible en `http://localhost:5173`

## Notas Importantes

- El proyecto **NO usa Prisma** ni ningún ORM
- Todas las queries se realizan directamente con el driver `pg` de PostgreSQL
- El script `init.sql` incluye:
  - Creación de tabla con constraints
  - Índices para optimización
  - Trigger para actualización automática de `updated_at`
  - Datos de ejemplo (10 cursos)
