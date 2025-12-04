<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use App\Models\User;
use App\Models\Medico;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use App\Mail\CitaConfirmada;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB; 
use Illuminate\Validation\ValidationException;

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
        $request->validate([
            'medico_id' => 'required|exists:medicos,id',
            'fecha_cita' => 'required|date|after_or_equal:today',
            'hora_cita' => 'required',
            'modo_paciente' => 'required|in:existente,nuevo',
        ]);

        DB::transaction(function () use ($request) {
            
            $pacienteId = null;

            // 1. Resolver quién es el paciente
            if ($request->modo_paciente === 'existente') {
                $request->validate(['paciente_id' => 'required|exists:users,id']);
                $pacienteId = $request->paciente_id;
            } else {
                $request->validate([
                    'nuevo_nombre' => 'required|string',
                    'nuevo_email' => 'required|email|unique:users,email',
                    'nuevo_telefono' => 'required|string',
                ]);

                $nuevoPaciente = User::create([
                    'name' => $request->nuevo_nombre,
                    'email' => $request->nuevo_email,
                    'phone' => $request->nuevo_telefono,
                    'role' => 'paciente',
                    'password' => Hash::make($request->nuevo_telefono),
                    'is_active' => true
                ]);
                
                $pacienteId = $nuevoPaciente->id;
            }

            // 2. Validación de Disponibilidad
            $existe = Cita::where('medico_id', $request->medico_id)
                        ->where('fecha_cita', $request->fecha_cita)
                        ->where('hora_cita', $request->hora_cita)
                        ->where('estado', '!=', 'cancelada')
                        ->exists();

            if ($existe) {
                // --- AQUÍ ESTABA EL ERROR (Quitamos el 'new') ---
                throw ValidationException::withMessages([
                    'hora_cita' => 'El médico ya tiene una cita agendada en ese horario.'
                ]);
            }

            // 3. Crear la Cita
            $cita = Cita::create([
                'paciente_id' => $pacienteId,
                'medico_id' => $request->medico_id,
                'fecha_cita' => $request->fecha_cita,
                'hora_cita' => $request->hora_cita,
                'observaciones' => $request->observaciones,
                'estado' => 'pendiente'
            ]);

            // 4. Enviar correo
            $paciente = User::find($pacienteId);
            if ($paciente) {
                Mail::to($paciente->email)->send(new CitaConfirmada($cita));
            }
        });

        return redirect()->back()->with('success', 'Cita agendada correctamente.');
    }

    // 1. Mostrar formulario simple para paciente
    public function createForPatient()
    {
        // Solo enviamos la lista de médicos (con sus nombres de usuario)
        $medicos = Medico::with('user')->get();

        return Inertia::render('Paciente/Agendar', [
            'medicos' => $medicos
        ]);
    }

    // 2. Guardar la cita del paciente
    public function storeForPatient(Request $request)
    {
        $request->validate([
            'medico_id' => 'required|exists:medicos,id',
            'fecha_cita' => 'required|date|after_or_equal:today',
            'hora_cita' => 'required',
            'observaciones' => 'nullable|string'
        ]);

        // Validación de disponibilidad (Igual que el admin)
        $existe = Cita::where('medico_id', $request->medico_id)
                      ->where('fecha_cita', $request->fecha_cita)
                      ->where('hora_cita', $request->hora_cita)
                      ->where('estado', '!=', 'cancelada')
                      ->exists();

        if ($existe) {
            return back()->withErrors(['hora_cita' => 'El médico ya no está disponible a esa hora.']);
        }

        // Crear cita (El paciente_id es el usuario logueado)
        Cita::create([
            'paciente_id' => auth()->id(), // <--- AUTOMÁTICO
            'medico_id' => $request->medico_id,
            'fecha_cita' => $request->fecha_cita,
            'hora_cita' => $request->hora_cita,
            'observaciones' => $request->observaciones,
            'estado' => 'pendiente'
        ]);

        // Redirigir al dashboard del paciente
        return redirect()->route('dashboard')->with('success', '¡Tu cita ha sido solicitada!');
    }

    // Cambiar estado de la cita (Cancelar/Confirmar)
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'estado' => 'required|in:pendiente,confirmada,cancelada'
        ]);

        $cita = Cita::findOrFail($id);
        
        // Evitar cambiar citas que ya fueron completadas (historial médico cerrado)
        if ($cita->estado === 'completada') {
            return back()->withErrors(['error' => 'No se puede modificar una cita ya atendida.']);
        }

        $cita->update(['estado' => $request->estado]);

        return back()->with('success', 'Estado de la cita actualizado.');
    }

    // Método para devolver citas en formato JSON para FullCalendar
    public function getEvents()
    {
        $citas = Cita::with(['paciente', 'medico.user'])
            ->where('estado', '!=', 'cancelada')
            ->get();

        $eventos = $citas->map(function ($cita) {
            // Definir color según estado
            $color = match ($cita->estado) {
                'pendiente' => '#f59e0b', // Amarillo
                'confirmada' => '#3b82f6', // Azul
                'completada' => '#10b981', // Verde
                default => '#6b7280',
            };

            return [
                'id' => $cita->id,
                'title' => $cita->paciente->name . ' (Dr. ' . $cita->medico->user->name . ')',
                'start' => $cita->fecha_cita . 'T' . $cita->hora_cita, // Formato ISO 8601
                'backgroundColor' => $color,
                'borderColor' => $color,
                'extendedProps' => [
                    'medico' => $cita->medico->user->name,
                    'estado' => $cita->estado
                ]
            ];
        });

        return response()->json($eventos);
    }

    public function calendarView()
    {
        return Inertia::render('Admin/Calendario');
    }
}