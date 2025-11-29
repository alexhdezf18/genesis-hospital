<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use App\Models\User;
use App\Models\Medico;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CitaController extends Controller
{
    public function index()
    {
        // 1. Traer citas con datos relacionados (Paciente y Médico)
        $citas = Cita::with(['paciente', 'medico.user'])
                    ->latest('fecha_cita')
                    ->paginate(10);

        // 2. Listas para los Selects del Formulario
        $pacientes = User::where('role', 'paciente')->get(['id', 'name', 'email']);
        
        $medicos = Medico::with('user')->get();

        return Inertia::render('Admin/Citas', [
            'citas' => $citas,
            'pacientes' => $pacientes,
            'medicos' => $medicos
        ]);
    }

    public function store(Request $request)
    {
        // Validación de datos básicos
        $request->validate([
            'paciente_id' => 'required|exists:users,id',
            'medico_id' => 'required|exists:medicos,id',
            'fecha_cita' => 'required|date|after_or_equal:today',
            'hora_cita' => 'required',
            'observaciones' => 'nullable|string'
        ]);

        // 3. VALIDACIÓN DE DISPONIBILIDAD (Lógica de Negocio)
        // Verificamos si ya hay una cita para ese médico, ese día, a esa hora
        $existe = Cita::where('medico_id', $request->medico_id)
                      ->where('fecha_cita', $request->fecha_cita)
                      ->where('hora_cita', $request->hora_cita)
                      ->where('estado', '!=', 'cancelada')
                      ->exists();

        if ($existe) {
            return back()->withErrors(['hora_cita' => 'El médico ya tiene una cita agendada en ese horario.']);
        }

        // Crear la cita
        Cita::create([
            'paciente_id' => $request->paciente_id,
            'medico_id' => $request->medico_id,
            'fecha_cita' => $request->fecha_cita,
            'hora_cita' => $request->hora_cita,
            'observaciones' => $request->observaciones,
            'estado' => 'pendiente'
        ]);

        return redirect()->back()->with('success', 'Cita agendada correctamente.');
    }
}