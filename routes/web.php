<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
// Importamos todos los controladores
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CitaController;
use App\Http\Controllers\ConsultaController;
use App\Http\Controllers\PagoController;
use App\Http\Controllers\MedicamentoController;

// 1. Página de Bienvenida (Pública)
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// 2. Dashboard Principal (Redirección inteligente)
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// 3. Grupo de Rutas Protegidas (Lógica del Negocio)
Route::middleware(['auth', 'verified'])->group(function () {
    
    // --- Módulo de Usuarios ---
    Route::get('/admin/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/admin/users', [UserController::class, 'store'])->name('users.store');

    // --- Módulo de Citas ---
    Route::get('/admin/citas', [CitaController::class, 'index'])->name('citas.index');
    Route::post('/admin/citas', [CitaController::class, 'store'])->name('citas.store');
    Route::patch('/citas/{id}/status', [CitaController::class, 'updateStatus'])->name('citas.updateStatus');

    // --- Módulo de Farmacia / Medicamentos (MOVIDO AQUÍ) ---
    Route::get('/admin/farmacia', [MedicamentoController::class, 'index'])->name('medicamentos.index');
    Route::post('/admin/farmacia', [MedicamentoController::class, 'store'])->name('medicamentos.store');

    // --- Módulo de Medico ---
    Route::get('/medico/atender/{cita}', [ConsultaController::class, 'create'])->name('consulta.create');
    Route::post('/medico/atender', [ConsultaController::class, 'store'])->name('consulta.store');

    // --- Módulo de Pago ---
    Route::post('/pagos', [PagoController::class, 'store'])->name('pagos.store');

    // --- Módulo de PDF ---
    Route::get('/receta/{id}/pdf', [ConsultaController::class, 'downloadPdf'])->name('receta.pdf');

    // --- Modulo de Paciente ---
    Route::get('/mi-portal/agendar', [CitaController::class, 'createForPatient'])->name('paciente.agendar');
    Route::post('/mi-portal/agendar', [CitaController::class, 'storeForPatient'])->name('paciente.store');

    // --- Calendario ---
    Route::get('/api/citas-calendar', [CitaController::class, 'getEvents'])->name('api.citas');
    Route::get('/admin/calendario', [CitaController::class, 'calendarView'])->name('citas.calendar');
});

// 4. Grupo de Perfil (Configuración de cuenta de usuario)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';