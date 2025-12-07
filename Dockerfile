# Usamos una imagen oficial de PHP con Apache
FROM php:8.2-apache

# 1. Instalar dependencias del sistema y Node.js
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl \
    libzip-dev \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# 2. Limpiar caché
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# 3. Instalar extensiones de PHP necesarias para Laravel
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# 4. Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 5. Configurar Apache (Document Root a /public)
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf
RUN a2enmod rewrite

# 6. Copiar el código del proyecto
WORKDIR /var/www/html
COPY . .

# 7. Instalar dependencias de Backend (PHP)
RUN composer install --no-interaction --optimize-autoloader --no-dev

# 8. Instalar dependencias de Frontend (React) y compilar
RUN npm install
RUN npm run build

# 9. Dar permisos a las carpetas de almacenamiento
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# 10. Exponer el puerto 80
EXPOSE 80