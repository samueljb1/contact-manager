# Usa una imagen base de PHP (usaremos PHP con Nginx y Composer)
FROM php:8.1-fpm

# Instala dependencias necesarias y Composer
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libssl-dev \
    unzip \
    git \
    curl \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Establece el directorio de trabajo
WORKDIR /var/www

# Copia los archivos del proyecto
COPY . .

# Instala las dependencias de Laravel usando Composer
RUN composer install --no-dev --optimize-autoloader

# Configura los permisos para Laravel
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Exponer el puerto 9000 para que Nginx lo pueda usar
EXPOSE 9000

# Usa un servidor PHP-FPM para correr la aplicación
CMD ["php-fpm"]
