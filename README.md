# Contact Manager

Aplicación full-stack desarrollada con **Laravel 12**, **Inertia.js**, **React** y **Tailwind CSS**, que permite gestionar una agenda de contactos de manera moderna, rápida y visual. Incluye filtros en tiempo real, exportación a CSV, edición inline con validaciones, gráficas estadísticas y un diseño limpio y responsivo.

## Funcionalidades principales

- CRUD completo de contactos
- Filtro por nombre y provincia (insensible a mayúsculas)
- Exportación de contactos a CSV con filtros aplicados
- Edición inline con validaciones visuales
- Gráfica de contactos por provincia con Chart.js
- Diseño profesional responsivo con Tailwind CSS
- Paginación con filtros preservados
- Autenticación y control de acceso

## Tecnologías usadas

**Backend**
- Laravel 12
- PHP 8.4
- PostgreSQL
- Composer

**Frontend**
- React + Inertia.js
- Tailwind CSS
- JSX + Vite
- Chart.js
- Laravel Breeze
- Inertia Adapter
- Exportación a CSV
- NPM

## Requisitos previos

- PHP 8.2 o superior
- Composer
- Node.js 18 o superior
- PostgreSQL instalado y en ejecución
- Git

## Instalación local paso a paso

1. Clonar el repositorio

```bash
git clone https://github.com/samueljb1/contact-manager.git
cd contact-manager
```

2. Instalar dependencias backend y frontend

```bash
composer install
npm install
```

3. Configurar entorno

Copiar el archivo `.env.example` a `.env` y generar la clave de la aplicación:

```bash
cp .env.example .env
php artisan key:generate
```

Editar el archivo `.env` y configurar la conexión a la base de datos PostgreSQL:

```
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=contact_manager
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
```

4. Ejecutar las migraciones:

```bash
php artisan migrate
```

5. Levantar los servidores de desarrollo:

```bash
php artisan serve
npm run dev
```

6. Acceder desde el navegador:

```
http://127.0.0.1:8000
```

Registrarse para crear un usuario y comenzar a gestionar contactos.
