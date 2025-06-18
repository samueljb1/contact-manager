# Usa una imagen oficial de PHP con Apache y extensiones necesarias
FROM php:8.2-apache

# Instala dependencias del sistema necesarias
RUN apt-get update && apt-get install -y \
    git unzip curl libpq-dev libzip-dev zip \
    && docker-php-ext-install pdo pdo_pgsql zip

# Instala Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copia archivos de Laravel al contenedor
COPY . /var/www/html

# Establece directorio de trabajo
WORKDIR /var/www/html

# Instala dependencias PHP (Laravel)
RUN composer install --no-dev --optimize-autoloader

# Asigna permisos a directorios necesarios
RUN chmod -R 775 storage bootstrap/cache && \
    chown -R www-data:www-data storage bootstrap/cache

# Expone puerto 80 para Render
EXPOSE 80

# Comando que se ejecutará al iniciar el contenedor
CMD ["apache2-foreground"]


