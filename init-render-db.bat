@echo off
echo ========================================
echo Inicializando Base de Datos en Render
echo ========================================
echo.
echo Este script inicializara la base de datos remota
echo con la tabla de cursos y datos de ejemplo.
echo.
set /p db_url="Pega la DATABASE_URL de Render: "
echo.
echo Conectando y ejecutando script...
cd backend\scripts
node init-db-remote.js "%db_url%"
echo.
pause
