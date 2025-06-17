# Imagen oficial PHP con Apache
FROM php:8.2-apache

# Instala dependencias necesarias
RUN apt-get update && apt-get install -y \
    git unzip curl zip libzip-dev libpq-dev nodejs npm \
    && docker-php-ext-install pdo pdo_pgsql zip

# Instala Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Establece el directorio de trabajo
WORKDIR /var/www/html

# Copia los archivos de la aplicación
COPY . .

# Instala dependencias PHP
RUN composer install --no-dev --optimize-autoloader

# Compila assets
RUN npm install && npm run build

# Establece permisos correctos para Laravel
RUN chmod -R 775 storage bootstrap/cache

# Exponer el puerto HTTP
EXPOSE 80

# Comando para iniciar Laravel
CMD php artisan migrate --force && apache2-foreground
