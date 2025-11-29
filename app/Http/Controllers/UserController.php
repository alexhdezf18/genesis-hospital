<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Medico;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UserController extends Controller
{
    // 1. Mostrar la lista de usuarios
    public function index()
    {
        // Traemos usuarios paginados (10 por página) y ordenados
        // 'with' es para traer datos del médico si existen (Eager Loading)
        $users = User::with('medico')->latest()->paginate(10);

        return Inertia::render('Admin/Users', [
            'users' => $users
        ]);
    }

    // 2. Guardar nuevo usuario
    public function store(Request $request)
    {
        // Validaciones del Backend
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,medico,paciente,recepcionista',
            // Validaciones condicionales: Si es médico, exigimos estos campos
            'specialty' => 'required_if:role,medico',
            'license_number' => 'required_if:role,medico|unique:medicos,license_number',
        ]);

        try {
            DB::transaction(function () use ($request) {
                // Crear Usuario Base
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'role' => $request->role,
                    'phone' => $request->phone,
                ]);

                // Si es médico, crear perfil profesional
                if ($request->role === 'medico') {
                    Medico::create([
                        'user_id' => $user->id,
                        'specialty' => $request->specialty,
                        'license_number' => $request->license_number,
                    ]);
                }
            });

            // Inertia se encarga de recargar la página automáticamente
            return redirect()->back()->with('success', 'Usuario creado correctamente.');

        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Error al guardar: ' . $e->getMessage()]);
        }
    }
}