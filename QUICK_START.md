# Guía Rápida de Ejecución - Sistema de Gestión de Cursos

## ⚡ Inicio Rápido

### 1️⃣ Preparar Base de Datos
```powershell
# Crear base de datos PostgreSQL
psql -U postgres -c "CREATE DATABASE cursos_db;"
```

### 2️⃣ Configurar e Iniciar Backend
```powershell
# Terminal 1
cd "c:\Users\Dell Inspiron 16\Desktop\ExamenIngenieriaWeb\backend"
npm install
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```
✅ Backend corriendo en: **http://localhost:3001**

### 3️⃣ Configurar e Iniciar Frontend
```powershell
# Terminal 2 (nueva terminal)
cd "c:\Users\Dell Inspiron 16\Desktop\ExamenIngenieriaWeb\frontend"
npm install
npm run dev
```
✅ Frontend corriendo en: **http://localhost:3000**

---

## 🧪 Ejecutar Pruebas

### Pruebas Backend
```powershell
cd backend
npm test
```

### Pruebas Frontend
```powershell
cd frontend
npm test
```

### Pruebas de Estrés (k6)
```powershell
# Instalar k6 primero: choco install k6
k6 run stress-test.js
```

---

## 🔍 Verificar que Todo Funciona

### Health Check del Backend
```powershell
curl http://localhost:3001/health
```

### Probar API
```powershell
# Listar cursos
curl http://localhost:3001/cursos

# Promedio de créditos
curl http://localhost:3001/cursos/promedio-creditos

# Filtrar por área
curl "http://localhost:3001/cursos?area=Ingeniería"
```

### Abrir Frontend
Abre tu navegador en: **http://localhost:3000**

---

## 📋 Checklist de Verificación

- [ ] PostgreSQL instalado y corriendo
- [ ] Base de datos `cursos_db` creada
- [ ] Backend `.env` configurado
- [ ] Dependencias del backend instaladas
- [ ] Migraciones de Prisma ejecutadas
- [ ] Backend corriendo en puerto 3001
- [ ] Dependencias del frontend instaladas
- [ ] Frontend corriendo en puerto 3000
- [ ] Puedes ver la lista de cursos en el navegador

---

## 🆘 Solución de Problemas

### Error: "Cannot connect to database"
- Verifica que PostgreSQL esté corriendo
- Verifica el `DATABASE_URL` en `backend/.env`
- Verifica que la base de datos `cursos_db` exista

### Error: "Port 3001 already in use"
- Mata el proceso: `Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process`
- O cambia el puerto en `backend/.env`

### Error: "Module not found"
- Ejecuta `npm install` en la carpeta correspondiente
- Borra `node_modules` y `package-lock.json`, luego `npm install`

---

## 🚀 Script Automático

Ejecuta el script de configuración:
```powershell
.\setup.ps1
```

Luego solo necesitas abrir 2 terminales y ejecutar:
- Terminal 1: `cd backend && npm run dev`
- Terminal 2: `cd frontend && npm run dev`
