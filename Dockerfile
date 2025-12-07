# Usamos una imagen oficial de PHP con Apache
FROM php:8.4-apache

# 1. Instalar TODAS las dependencias del sistema y Node.js en un solo paso
# Incluimos libpq-dev (para Postgres), librerías para GD, Zip, etc.
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl \
    libzip-dev \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 2. Instalar TODAS las extensiones de PHP juntas
# Aquí aseguramos que pdo_pgsql y pdo_mysql convivan sin problemas
RUN docker-php-ext-install pdo pdo_pgsql pdo_mysql mbstring exif pcntl bcmath gd zip

# 3. Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 4. Configurar Apache (Document Root a /public)
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf
RUN a2enmod rewrite

# 5. Copiar el código del proyecto
WORKDIR /var/www/html
COPY . .

# 6. Instalar dependencias de Backend (PHP)
RUN composer install --no-interaction --optimize-autoloader --no-dev

# 7. Instalar dependencias de Frontend (React) y compilar
RUN npm install
RUN npm run build

# 8. Dar permisos a las carpetas de almacenamiento
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# 9. Exponer el puerto 80
EXPOSE 80