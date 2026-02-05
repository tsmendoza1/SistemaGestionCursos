#!/bin/bash

# Script para inicializar la base de datos en Render
# Este script se ejecuta manualmente después de crear la base de datos

echo "Inicializando base de datos en Render..."

# La DATABASE_URL se obtiene de las variables de entorno de Render
psql $DATABASE_URL -f scripts/init.sql

echo "Base de datos inicializada correctamente"
