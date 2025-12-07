<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Medico;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Validation\Rule; 

class UserController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $users = User::with('medico')
            ->when($search, function ($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,medico,paciente,recepcionista',
            'specialty' => 'required_if:role,medico',
            'license_number' => 'required_if:role,medico|unique:medicos,license_number',
        ]);

        try {
            DB::transaction(function () use ($request) {
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'role' => $request->role,
                    'phone' => $request->phone,
                ]);

                if ($request->role === 'medico') {
                    Medico::create([
                        'user_id' => $user->id,
                        'specialty' => $request->specialty,
                        'license_number' => $request->license_number,
                    ]);
                }
            });

            return redirect()->back()->with('success', 'Usuario creado correctamente.');

        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Error: ' . $e->getMessage()]);
        }
    }

    // --- NUEVO: MÉTODO ACTUALIZAR ---
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            // Validación especial: El email debe ser único, PERO ignorando al usuario actual ($user->id)
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'role' => 'required|in:admin,medico,paciente,recepcionista',
            // La contraseña es opcional al editar ('nullable')
            'password' => 'nullable|string|min:8',
            'specialty' => 'required_if:role,medico',
            // La cédula es única ignorando la cédula actual de este médico (si existe)
            'license_number' => $user->medico 
                ? ['required_if:role,medico', Rule::unique('medicos')->ignore($user->medico->id)]
                : ['required_if:role,medico', 'unique:medicos,license_number'],
        ]);

        DB::transaction(function () use ($request, $user) {
            // Actualizar datos básicos
            $userData = [
                'name' => $request->name,
                'email' => $request->email,
                'role' => $request->role,
                'phone' => $request->phone,
            ];

            // Solo actualizamos password si el usuario escribió algo nuevo
            if ($request->filled('password')) {
                $userData['password'] = Hash::make($request->password);
            }

            $user->update($userData);

            // Lógica de Médico
            if ($request->role === 'medico') {
                // Si ya era médico, actualizamos. Si no, creamos.
                $user->medico()->updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'specialty' => $request->specialty,
                        'license_number' => $request->license_number
                    ]
                );
            } else {
                // Si cambió de rol y ya no es médico, borramos su perfil médico
                if ($user->medico) {
                    $user->medico()->delete();
                }
            }
        });

        return redirect()->back()->with('success', 'Usuario actualizado correctamente.');
    }

    // MÉTODO ELIMINAR ---
    public function destroy(User $user)
    {
        // Evitar auto-suicidio (No borrar tu propia cuenta)
        if (auth()->id() === $user->id) {
            return back()->withErrors(['error' => 'No puedes eliminar tu propia cuenta.']);
        }

        $user->delete(); // Soft Delete (gracias a la migración que hicimos)

        return redirect()->back()->with('success', 'Usuario eliminado correctamente.');
    }

    // --- MÉTODO RECUPERADO PARA BÚSQUEDA EN VIVO ---
    public function search(Request $request)
    {
        $query = $request->input('q');
        
        if (!$query) return response()->json([]);

        $pacientes = User::where('role', 'paciente')
            ->where(function($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('phone', 'like', "%{$query}%")
                  ->orWhere('email', 'like', "%{$query}%");
            })
            ->limit(5)
            ->get(['id', 'name', 'phone', 'email']);

        return response()->json($pacientes);
    }

}
