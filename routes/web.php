<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ContactController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Página principal
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Dashboard, accesible solo por usuarios autenticados
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Rutas protegidas por autenticación para contactos
Route::middleware('auth')->group(function () {
    // Mostrar lista de contactos
    Route::get('/contacts', [ContactController::class, 'index'])->name('contacts.index');
    
    // Ver formulario para crear un nuevo contacto
    Route::get('/contacts/create', [ContactController::class, 'create'])->name('contacts.create');
    
    // Almacenar nuevo contacto
    Route::post('/contacts', [ContactController::class, 'store'])->name('contacts.store');
    
    // Ver formulario para editar un contacto existente
    Route::get('/contacts/{contact}/edit', [ContactController::class, 'edit'])->name('contacts.edit');
    
    // Actualizar un contacto existente
    Route::put('/contacts/{contact}', [ContactController::class, 'update'])->name('contacts.update');
    
    // Eliminar un contacto
    Route::delete('/contacts/{contact}', [ContactController::class, 'destroy'])->name('contacts.destroy');
    
    // Perfil del usuario
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Requiere el archivo de autenticación
require __DIR__.'/auth.php';
