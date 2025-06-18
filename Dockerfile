# Usa una imagen oficial de PHP con Apache y extensiones necesarias 
FROM php:8.2-apache

# Instala dependencias del sistema necesarias
RUN apt-get update && apt-get install -y \
    git unzip curl libpq-dev libzip-dev zip \
    && docker-php-ext-install pdo pdo_pgsql zip

# Instala Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copia archivos del proyecto al contenedor
COPY . /var/www/html

# Establece directorio de trabajo
WORKDIR /var/www/html

# Establece DocumentRoot a public/
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf && \
    sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|' /etc/apache2/sites-available/000-default.conf && \
    sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

# Habilita módulo rewrite para Laravel
RUN a2enmod rewrite

# Instala dependencias PHP
RUN composer install --no-dev --optimize-autoloader

# Asigna permisos a directorios necesarios
RUN chmod -R 775 storage bootstrap/cache && \
    chown -R www-data:www-data storage bootstrap/cache

# Expone el puerto 80
EXPOSE 80

# Comando de inicio
CMD ["apache2-foreground"]


