Contact Manager

Aplicación full-stack desarrollada con **Laravel 12 + Inertia.js + React + Tailwind CSS**, que permite gestionar una agenda de contactos de forma moderna, rápida y visual. Incluye filtros en tiempo real, exportación a CSV, edición inline con validaciones, gráficas estadísticas y un diseño limpio y responsivo.

##Funcionalidades principales

- CRUD completo de contactos
- Filtro por nombre y provincia (insensible a mayúsculas)
- Exportación de contactos a CSV con filtros aplicados
- Edición inline con validaciones visuales
- Gráfica de contactos por provincia con Chart.js
- Diseño profesional responsivo (Tailwind CSS)
- Paginación con filtros preservados
- Autenticación y control de acceso

##Tecnologías usadas

Backend    
Laravel 12
React + Inertia.js
PostgreSQL (Base de datos) 
PHP 8.4
JSX + Vite
Tailwind CSS
Composer
NPM              
Chart.js, Export CSV
Laravel Breeze
Inertia Adapter


##Requisitos previos

- PHP 8.2 o superior
- Composer
- Node.js 18+ y NPM
- PostgreSQL instalado y configurado
- Git

##Instalación local paso a paso

1. Clona el repositorio


git clone https://github.com/samueljb1/contact-manager.git
cd contact-manager

Instala dependencias backend y frontend

composer install
npm install

Configura tu entorno

Copia el archivo .env y genera la clave de la app:

cp .env.example .env
php artisan key:generate


Edita .env y configura tu conexión PostgreSQL:

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=contact_manager
DB_USERNAME=usuario
DB_PASSWORD=contraseña


Ejecuta migraciones:

php artisan migrate


Ejecuta el servidor de desarrollo:

php artisan serve
npm run dev

Abre en el navegador:

http://127.0.0.1:8000

Regístrate y crea tu usuario.

