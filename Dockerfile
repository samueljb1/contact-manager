# Etapa 1: Build de frontend con Vite
FROM node:18-alpine as frontend

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY resources/ resources/
COPY vite.config.js ./
RUN npm run build


# Etapa 2: PHP con Apache
FROM php:8.2-apache

# Instalar dependencias necesarias
RUN apt-get update && apt-get install -y \
    git curl unzip libzip-dev libpq-dev zip \
    && docker-php-ext-install pdo pdo_pgsql zip

# Habilitar mod_rewrite
RUN a2enmod rewrite

# Cambiar DocumentRoot a /var/www/html/public
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf && \
    sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copiar todo el proyecto
COPY . /var/www/html

# Entrar al directorio y ejecutar composer install
WORKDIR /var/www/html
RUN composer install --no-dev --optimize-autoloader

# Copiar assets frontend ya compilados
COPY --from=frontend /app/public /var/www/html/public

# Permisos correctos
RUN chown -R www-data:www-data /var/www/html && chmod -R 755 /var/www/html

EXPOSE 80

CMD ["apache2-foreground"]


