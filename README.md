#  Contact Manager

Aplicación full-stack desarrollada con **Laravel 12 + Inertia.js + React + Tailwind CSS**, que permite gestionar una agenda de contactos de forma moderna, rápida y visual. Incluye filtros en tiempo real, exportación a CSV, edición inline con validaciones, gráficas estadísticas y un diseño limpio y responsivo.

---

##  Funcionalidades principales

- 📄 CRUD completo de contactos
- 🔍 Filtro por nombre y provincia (insensible a mayúsculas)
- 📤 Exportación de contactos a CSV con filtros aplicados
- ✏️ Edición inline con validaciones visuales
- 📊 Gráfica de contactos por provincia con Chart.js
- 📱 Diseño profesional responsivo (Tailwind CSS)
- 🌐 Paginación con filtros preservados
- 🔒 Autenticación y control de acceso

---

##  Tecnologías usadas

| Backend        | Frontend           | Otros                     |
|----------------|--------------------|----------------------------|
| Laravel 12     | React + Inertia.js | PostgreSQL (Base de datos) |
| PHP 8.4        | JSX + Vite         | Tailwind CSS               |
| Composer       | NPM                | Chart.js, Export CSV       |
| Laravel Breeze | Inertia Adapter    | Render (Deploy)            |

---

##  Requisitos previos

- PHP 8.2 o superior
- Composer
- Node.js 18+ y NPM
- PostgreSQL instalado y configurado
- Git

---

##  Instalación local paso a paso

1. **Clona el repositorio**

```bash
git clone https://github.com/samueljb1/contact-manager.git
cd contact-manager

Instala dependencias backend y frontend


composer install
npm install
Configura tu entorno

Copia el archivo .env base y genera la clave de la app:


cp .env.example .env
php artisan key:generate
Edita .env y configura tu conexión PostgreSQL:

ini
Copiar
Editar
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=contact_manager
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
Ejecuta migraciones


php artisan migrate
(Agrega php artisan db:seed si se agregan seeds en el futuro)

Ejecuta el servidor de desarrollo


php artisan serve
npm run dev

Abre en el navegador:


http://127.0.0.1:8000
Regístrate y comienza a gestionar contactos.

 Funcionalidades implementadas
 Gestión de contactos
Formulario para crear

Edición inline sin salir de la tabla

Eliminación con confirmación

Validación visual al editar en línea

Filtros inteligentes
Buscar por nombre (insensible a mayúsculas/minúsculas)

Filtrar por provincia

Borrar filtros y restaurar vista original

Exportar CSV
Exporta los contactos que coinciden con los filtros activos

Archivo .csv descargable con los datos visibles

Visualización de estadísticas
Gráfico de barras con cantidad de contactos por provincia usando Chart.js

Diseño y experiencia de usuario

-Responsive con Tailwind

-Estilo limpio y profesional

-Controles intuitivos

