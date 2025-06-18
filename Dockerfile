# Etapa 1: Build assets
FROM node:18-alpine as frontend

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY resources ./resources
COPY vite.config.js ./
RUN npm run build


# Etapa 2: PHP + Composer
FROM php:8.2-apache

# Instalar extensiones necesarias
RUN apt-get update && apt-get install -y \
    git curl unzip libpq-dev libzip-dev libpng-dev libonig-dev libxml2-dev zip \
    && docker-php-ext-install pdo pdo_pgsql zip

# Habilitar mod_rewrite
RUN a2enmod rewrite

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copiar la app
WORKDIR /var/www/html
COPY . .

# Copiar assets compilados del frontend
COPY --from=frontend /app/public ./public

# Permisos
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Exponer el puerto
EXPOSE 80

CMD ["apache2-foreground"]
