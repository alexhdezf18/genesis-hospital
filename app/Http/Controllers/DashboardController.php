<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Medico;
use App\Models\Cita;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        switch ($user->role) {
            case 'admin':
                // 1. Calcular Estadísticas Reales
                $totalPacientes = User::where('role', 'paciente')->count();
                $totalMedicos = Medico::count();
                $citasHoy = Cita::whereDate('fecha_cita', today())->count();

                // 2. Enviar datos a la vista 'Admin/Dashboard'
                return Inertia::render('Admin/Dashboard', [
                    'stats' => [
                        'pacientes' => $totalPacientes,
                        'medicos'   => $totalMedicos,
                        'citas_hoy' => $citasHoy,
                    ]
                ]);
            
            case 'medico':
                return Inertia::render('Medico/Dashboard');
            
            case 'paciente':
                return Inertia::render('Paciente/Dashboard');
            
            case 'recepcionista':
                return Inertia::render('Recepcionista/Dashboard');
                
            default:
                return redirect('/');
        }
    }
}