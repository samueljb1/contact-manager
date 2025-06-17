# Usa la imagen base de PHP-FPM 8.4
FROM php:8.4-fpm

# Instala dependencias necesarias para Laravel y Nginx
RUN apt-get update && apt-get install -y \
    nginx \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    curl \
    git \
    unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd \
    && curl -sS https://getcomposer.org/installer | php \
    && mv composer.phar /usr/local/bin/composer

# Configura el directorio de trabajo
WORKDIR /var/www

# Copia el código de la aplicación al contenedor
COPY . .

# Instala las dependencias de Composer (Laravel)
RUN composer install --no-dev --optimize-autoloader

# Copia el archivo de configuración de Nginx
COPY ./nginx/default.conf /etc/nginx/sites-available/default

# Configura Nginx para escuchar en el puerto 80
EXPOSE 80

# Configura permisos en las carpetas de Laravel
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Inicia Nginx y PHP-FPM
CMD service nginx start && php-fpm
