FROM php:8.2-apache

# Instala dependencias del sistema
RUN apt-get update && apt-get install -y \
    git unzip curl libpq-dev libzip-dev zip \
    && docker-php-ext-install pdo pdo_pgsql zip

# Instala Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copia los archivos al contenedor
COPY . /var/www/html
WORKDIR /var/www/html

# Instala dependencias PHP
RUN composer install --no-dev --optimize-autoloader

# Da permisos necesarios
RUN chmod -R 775 storage bootstrap/cache && \
    chown -R www-data:www-data storage bootstrap/cache

EXPOSE 80

CMD ["apache2-foreground"]
