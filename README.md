# Sistema de Gestión de Cursos

Sistema web completo para la gestión de cursos académicos, implementado con arquitectura cliente-servidor utilizando Node.js, Next.js y PostgreSQL.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Pruebas](#pruebas)
- [API Endpoints](#api-endpoints)
- [Despliegue](#despliegue)
- [Estructura del Proyecto](#estructura-del-proyecto)

## ✨ Características

### Backend (API REST)
- ✅ **CRUD Completo**: Crear, Listar, Buscar, Actualizar y Eliminar cursos
- ✅ **Filtrado por Área**: Endpoint `/cursos?area=Ingeniería`
- ✅ **Cálculo de Promedio**: Endpoint `/cursos/promedio-creditos`
- ✅ **Validación de Datos**: Validaciones en campos obligatorios
- ✅ **Manejo de Errores**: Respuestas apropiadas (404, 400, 500)
- ✅ **Monitoreo**: Health check y métricas de rendimiento
- ✅ **Base de Datos**: PostgreSQL con Prisma ORM

### Frontend (Next.js)
- ✅ **Vista de Tabla**: Listado completo de cursos
- ✅ **Formularios**: Crear y editar cursos con validaciones
- ✅ **Vista de Detalle**: Información completa de cada curso
- ✅ **Filtros**: Filtrado dinámico por área
- ✅ **Estadísticas**: Visualización del promedio de créditos
- ✅ **Diseño Responsivo**: Interfaz adaptable a diferentes dispositivos

### Testing
- ✅ **Pruebas Unitarias Backend**: Jest + Supertest
- ✅ **Pruebas Unitarias Frontend**: Jest + Testing Library
- ✅ **Pruebas de Estrés**: k6 con usuarios concurrentes

## 🛠 Tecnologías

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma
- **Base de Datos**: PostgreSQL
- **Testing**: Jest, Supertest
- **Lenguaje**: TypeScript

### Frontend
- **Framework**: Next.js 16
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Testing**: Jest, Testing Library

### DevOps
- **Stress Testing**: k6
- **Despliegue Backend**: Render
- **Despliegue Frontend**: Vercel
- **Base de Datos**: Render PostgreSQL

## 📦 Requisitos Previos

- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm o yarn
- k6 (para pruebas de estrés)

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd ExamenIngenieriaWeb
```

### 2. Instalar Dependencias del Backend

```bash
cd backend
npm install
```

### 3. Instalar Dependencias del Frontend

```bash
cd ../frontend
npm install
```

## ⚙️ Configuración

### Backend

1. Crear archivo `.env` en la carpeta `backend`:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/cursos_db"
PORT=3001
```

2. Ejecutar migraciones de base de datos:

```bash
# Opción 1: Usar Prisma
npx prisma migrate dev --name init
npx prisma generate

# Opción 2: Usar script SQL directo
psql -U usuario -d cursos_db -f ../database/migration.sql
```

### Frontend

1. Crear archivo `.env.local` en la carpeta `frontend`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🏃 Ejecución

### Desarrollo

#### Backend
```bash
cd backend
npm run dev
# Servidor corriendo en http://localhost:3001
```

#### Frontend
```bash
cd frontend
npm run dev
# Aplicación corriendo en http://localhost:3000
```

### Producción

#### Backend
```bash
cd backend
npm run build
npm start
```

#### Frontend
```bash
cd frontend
npm run build
npm start
```

## 🧪 Pruebas

### Pruebas Unitarias Backend

```bash
cd backend
npm test

# Modo watch
npm run test:watch
```

**Cobertura**: Pruebas para todos los endpoints CRUD, filtros y cálculos.

### Pruebas Unitarias Frontend

```bash
cd frontend
npm test

# Modo watch
npm run test:watch
```

**Cobertura**: Componentes, servicios API y casos de error.

### Pruebas de Estrés (k6)

```bash
# Instalar k6 (si no está instalado)
# Windows: choco install k6
# macOS: brew install k6
# Linux: https://k6.io/docs/getting-started/installation/

# Ejecutar pruebas de estrés
k6 run stress-test.js

# Con URL personalizada
k6 run -e API_URL=http://localhost:3001 stress-test.js
```

**Configuración de Carga**:
- Ramp-up: 10 → 50 → 100 usuarios concurrentes
- Duración: 3 minutos
- Métricas: Tiempo de respuesta, tasa de errores

## 📡 API Endpoints

### Base URL
```
http://localhost:3001
```

### Endpoints

#### Health Check
```http
GET /health
```
Respuesta: Estado del servidor y métricas

#### Listar Cursos
```http
GET /cursos
GET /cursos?area=Ingeniería
```
Respuesta: Array de cursos

#### Obtener Curso por ID
```http
GET /cursos/:id
```
Respuesta: Objeto curso

#### Crear Curso
```http
POST /cursos
Content-Type: application/json

{
  "nombre": "Cálculo Diferencial",
  "descripcion": "Introducción al cálculo",
  "creditos": 4,
  "area": "Ingeniería"
}
```
Respuesta: Curso creado (201)

#### Actualizar Curso
```http
PUT /cursos/:id
Content-Type: application/json

{
  "creditos": 5
}
```
Respuesta: Curso actualizado

#### Eliminar Curso
```http
DELETE /cursos/:id
```
Respuesta: 204 No Content

#### Promedio de Créditos
```http
GET /cursos/promedio-creditos
```
Respuesta:
```json
{
  "promedioCreditos": 4.2
}
```

## 🌐 Despliegue

### Backend en Render

1. Crear nuevo Web Service en Render
2. Conectar repositorio
3. Configurar:
   - **Build Command**: `cd backend && npm install && npx prisma generate`
   - **Start Command**: `cd backend && npm start`
   - **Environment Variables**: `DATABASE_URL`

4. Crear PostgreSQL database en Render
5. Conectar database al Web Service

### Frontend en Vercel

1. Importar proyecto en Vercel
2. Configurar:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Environment Variables**: `NEXT_PUBLIC_API_URL`

3. Deploy automático en cada push

### Base de Datos

**Render PostgreSQL**:
1. Crear PostgreSQL instance
2. Copiar `DATABASE_URL`
3. Ejecutar migraciones:
```bash
psql <DATABASE_URL> -f database/migration.sql
```

## 📁 Estructura del Proyecto

```
ExamenIngenieriaWeb/
├── backend/
│   ├── src/
│   │   ├── __tests__/         # Pruebas unitarias
│   │   ├── middleware/         # Middleware de monitoreo
│   │   ├── routes/             # Rutas de la API
│   │   ├── index.ts            # Punto de entrada
│   │   └── prisma.ts           # Cliente Prisma
│   ├── prisma/
│   │   └── schema.prisma       # Esquema de base de datos
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
│
├── frontend/
│   ├── app/
│   │   ├── cursos/             # Páginas de cursos
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── lib/
│   │   └── api.ts              # Servicio API
│   ├── __tests__/              # Pruebas unitarias
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
│
├── database/
│   └── migration.sql           # Script de migración SQL
│
├── stress-test.js              # Pruebas de estrés k6
└── README.md
```

## 📊 Monitoreo

### Backend Metrics

Endpoint `/health` proporciona:
- Estado del servicio
- Uptime
- Número de requests
- Tiempo promedio de respuesta
- Tasa de errores

Ejemplo:
```json
{
  "status": "healthy",
  "uptime": 3600,
  "timestamp": "2026-02-05T19:00:00.000Z",
  "metrics": {
    "requestCount": 1523,
    "averageResponseTime": "45.23ms",
    "errors": 12
  }
}
```

## 🐛 Solución de Problemas

### Error de Conexión a Base de Datos
```bash
# Verificar que PostgreSQL esté corriendo
psql -U postgres -c "SELECT version();"

# Verificar DATABASE_URL en .env
echo $DATABASE_URL
```

### Error de CORS
Verificar que el frontend esté configurado en `cors()` del backend.

### Pruebas Fallan
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 📝 Licencia

Este proyecto fue desarrollado como parte de un examen de Ingeniería Web.

## 👥 Autor

[Tu Nombre]

## 📞 Contacto

Para preguntas o soporte, contactar a [tu-email@ejemplo.com]
