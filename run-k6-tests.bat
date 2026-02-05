@echo off
echo ========================================
echo Ejecutando Pruebas de Estres con K6
echo ========================================
echo.
echo IMPORTANTE: Asegurese de que el servidor este corriendo
echo            en otra terminal con: npm run dev
echo.
echo Opciones:
echo 1. Ejecutar K6 basico (solo consola)
echo 2. Ejecutar K6 con Grafana (visualizacion en tiempo real)
echo.
set /p option="Seleccione una opcion (1 o 2): "

if "%option%"=="1" (
    echo.
    echo Ejecutando K6 en modo basico...
    cd backend
    k6 run k6-stress-test.js
) else if "%option%"=="2" (
    echo.
    echo Ejecutando K6 con salida a InfluxDB para Grafana...
    echo Asegurese de que Docker este corriendo y ejecute:
    echo    docker-compose up -d
    echo.
    pause
    cd backend
    k6 run --out influxdb=http://localhost:8086/k6 k6-stress-test.js
    echo.
    echo Abra Grafana en: http://localhost:3000
    echo Usuario: admin
    echo Password: admin
) else (
    echo Opcion invalida
)

pause
