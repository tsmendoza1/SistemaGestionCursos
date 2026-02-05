# Script para ejecutar el proyecto completo
# Sistema de Gestión de Cursos

Write-Host "=== Configurando el Proyecto ===" -ForegroundColor Cyan

# 1. Crear base de datos (ejecutar manualmente si no existe)
Write-Host "`n1. Asegúrate de que PostgreSQL esté corriendo" -ForegroundColor Yellow
Write-Host "   Si no existe la base de datos, ejecuta:" -ForegroundColor Yellow
Write-Host "   psql -U postgres -c `"CREATE DATABASE cursos_db;`"" -ForegroundColor Gray

# 2. Backend
Write-Host "`n2. Configurando Backend..." -ForegroundColor Cyan
Set-Location "c:\Users\Dell Inspiron 16\Desktop\ExamenIngenieriaWeb\backend"

Write-Host "   Instalando dependencias..." -ForegroundColor Gray
npm install

Write-Host "   Ejecutando migraciones de Prisma..." -ForegroundColor Gray
npx prisma migrate dev --name init
npx prisma generate

Write-Host "`n   Backend configurado!" -ForegroundColor Green

# 3. Frontend
Write-Host "`n3. Configurando Frontend..." -ForegroundColor Cyan
Set-Location "c:\Users\Dell Inspiron 16\Desktop\ExamenIngenieriaWeb\frontend"

Write-Host "   Instalando dependencias..." -ForegroundColor Gray
npm install

Write-Host "`n   Frontend configurado!" -ForegroundColor Green

# 4. Instrucciones finales
Write-Host "`n=== Configuración Completa ===" -ForegroundColor Green
Write-Host "`nPara ejecutar el proyecto:" -ForegroundColor Cyan
Write-Host "`n  TERMINAL 1 - Backend:" -ForegroundColor Yellow
Write-Host "  cd `"c:\Users\Dell Inspiron 16\Desktop\ExamenIngenieriaWeb\backend`"" -ForegroundColor Gray
Write-Host "  npm run dev" -ForegroundColor Gray
Write-Host "  -> http://localhost:3001" -ForegroundColor Green

Write-Host "`n  TERMINAL 2 - Frontend:" -ForegroundColor Yellow
Write-Host "  cd `"c:\Users\Dell Inspiron 16\Desktop\ExamenIngenieriaWeb\frontend`"" -ForegroundColor Gray
Write-Host "  npm run dev" -ForegroundColor Gray
Write-Host "  -> http://localhost:3000" -ForegroundColor Green

Write-Host "`n=== Comandos Adicionales ===" -ForegroundColor Cyan
Write-Host "`n  Ejecutar tests del backend:" -ForegroundColor Yellow
Write-Host "  cd backend && npm test" -ForegroundColor Gray

Write-Host "`n  Ejecutar tests del frontend:" -ForegroundColor Yellow
Write-Host "  cd frontend && npm test" -ForegroundColor Gray

Write-Host "`n  Ejecutar pruebas de estrés (requiere k6):" -ForegroundColor Yellow
Write-Host "  k6 run stress-test.js" -ForegroundColor Gray

Write-Host "`n  Ver health check del backend:" -ForegroundColor Yellow
Write-Host "  curl http://localhost:3001/health" -ForegroundColor Gray

Write-Host "`n¡Listo para usar!" -ForegroundColor Green
