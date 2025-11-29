<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Medico;
use App\Models\Cita;
use App\Models\HistorialMedico;
use App\Models\Pago;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        switch ($user->role) {
            case 'admin':
                // 1. Estadísticas Básicas (KPIs)
                $totalPacientes = User::where('role', 'paciente')->count();
                $totalMedicos = Medico::count();
                $citasHoy = Cita::whereDate('fecha_cita', today())->count();
                
                // 2. DATOS PARA GRÁFICA DE INGRESOS (Últimos 7 días)
                // Agrupamos pagos por fecha
                $ingresosPorDia = Pago::selectRaw('DATE(created_at) as fecha, SUM(monto) as total')
                    ->where('created_at', '>=', now()->subDays(7))
                    ->groupBy('fecha')
                    ->orderBy('fecha', 'asc')
                    ->get();

                // Preparamos arrays simples para React
                $chartIngresos = [
                    'labels' => $ingresosPorDia->pluck('fecha')->map(fn($f) => date('d/m', strtotime($f))),
                    'data'   => $ingresosPorDia->pluck('total'),
                ];

                // 3. DATOS PARA GRÁFICA DE ESTADO DE CITAS
                $estadosCitas = Cita::selectRaw('estado, COUNT(*) as cantidad')
                    ->groupBy('estado')
                    ->pluck('cantidad', 'estado'); // Devuelve un array asociativo ['pendiente' => 5, 'completada' => 10]

                // Aseguramos que existan todos los estados aunque sean 0
                $chartEstados = [
                    'pendiente'  => $estadosCitas['pendiente'] ?? 0,
                    'confirmada' => $estadosCitas['confirmada'] ?? 0,
                    'completada' => $estadosCitas['completada'] ?? 0,
                    'cancelada'  => $estadosCitas['cancelada'] ?? 0,
                ];

                return Inertia::render('Admin/Dashboard', [
                    'stats' => [
                        'pacientes' => $totalPacientes,
                        'medicos'   => $totalMedicos,
                        'citas_hoy' => $citasHoy,
                    ],
                    'charts' => [
                        'ingresos' => $chartIngresos,
                        'estados'  => $chartEstados
                    ]
                ]);
            
            case 'medico':
                // 1. Obtener el ID del médico asociado al usuario logueado
                $medico = Medico::where('user_id', $user->id)->first();

                // 2. Traer sus citas (Pendientes o Confirmadas) ordenadas por hora
                // Usamos 'with' para traer también el nombre del paciente
                $citas = Cita::with('paciente')
                             ->where('medico_id', $medico->id)
                             ->whereIn('estado', ['pendiente', 'confirmada'])
                             ->orderBy('fecha_cita', 'asc')
                             ->orderBy('hora_cita', 'asc')
                             ->get();
    
                return Inertia::render('Medico/Dashboard', [
                    'citas' => $citas
                ]);
            
            case 'paciente':
                // 1. Próximas Citas (Pendientes o Confirmadas)
                $proximasCitas = Cita::with('medico.user') // Traemos al médico y su nombre
                    ->where('paciente_id', $user->id)
                    ->whereIn('estado', ['pendiente', 'confirmada'])
                    ->where('fecha_cita', '>=', now()->toDateString())
                    ->orderBy('fecha_cita')
                    ->get();
    
                // 2. Historial Médico (Consultas pasadas)
                $historial = HistorialMedico::with(['medico.user', 'cita'])
                    ->where('paciente_id', $user->id)
                    ->latest() // Ordenar del más reciente al más viejo
                    ->get();
    
                return Inertia::render('Paciente/Dashboard', [
                    'proximasCitas' => $proximasCitas,
                    'historial' => $historial
                ]);
            
            case 'recepcionista':
                // Buscamos citas que ya atendió el médico (completada)
                // PERO que no tengan un registro en la tabla pagos (doesntHave)
                $pendientesPago = Cita::with(['paciente', 'medico.user'])
                    ->where('estado', 'completada')
                    ->doesntHave('pago') 
                    ->orderBy('fecha_cita', 'desc')
                    ->get();
    
                return Inertia::render('Recepcionista/Dashboard', [
                    'pendientes' => $pendientesPago
                ]);
                
            default:
                return redirect('/');
        }
    }
}