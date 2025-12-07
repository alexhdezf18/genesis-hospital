#!/bin/sh
echo "🎬 Iniciando despliegue..."

# Correr migraciones de base de datos
php artisan migrate --force

# Iniciar Apache en primer plano
apache2-foreground