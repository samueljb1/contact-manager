# Imagen base con Apache + PHP
FROM php:8.2-apache

# Instala extensiones necesarias (PostgreSQL, ZIP, etc.)
RUN apt-get update && apt-get install -y \
    git unzip curl libpq-dev libzip-dev zip \
    && docker-php-ext-install pdo pdo_pgsql zip

# Habilita mod_rewrite para Laravel
RUN a2enmod rewrite

# Corrige el DocumentRoot a /public
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

# Copia Composer desde imagen oficial
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copia archivos del proyecto
COPY . /var/www/html

# Establece el directorio de trabajo
WORKDIR /var/www/html

# Instala dependencias de Laravel
RUN composer install --no-dev --optimize-autoloader

# Permisos necesarios
RUN chmod -R 775 storage bootstrap/cache && \
    chown -R www-data:www-data storage bootstrap/cache

# Expone el puerto 80
EXPOSE 80

# Comando para ejecutar en producción
CMD php artisan config:cache && \
    php artisan route:cache && \
    php artisan migrate --force && \
    apache2-foreground
