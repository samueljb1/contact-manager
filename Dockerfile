# Usa una imagen oficial de PHP con Apache y extensiones necesarias
FROM php:8.2-apache

# Instala dependencias necesarias del sistema
RUN apt-get update && apt-get install -y \
    git unzip curl libpq-dev libzip-dev zip \
    && docker-php-ext-install pdo pdo_pgsql zip

# Instala Composer desde imagen oficial
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copia los archivos del proyecto
COPY . /var/www/html

# Define el directorio de trabajo
WORKDIR /var/www/html

# Instala dependencias de Laravel
RUN composer install --no-dev --optimize-autoloader

# Permisos necesarios para Laravel
RUN chmod -R 775 storage bootstrap/cache && \
    chown -R www-data:www-data storage bootstrap/cache

# Exponer el puerto para Apache
EXPOSE 80

# Comando que se ejecuta al arrancar el contenedor
CMD php artisan config:cache && \
    php artisan route:cache && \
    php artisan migrate --force && \
    apache2-foreground



