<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use App\Models\User;
use App\Models\Medico;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use App\Mail\CitaConfirmada;

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
        // 1. Validar que venga el ID del paciente seleccionado
        $request->validate([
            'paciente_id' => 'required|exists:users,id', // <--- Importante validar esto
            'medico_id' => 'required|exists:medicos,id',
            'fecha_cita' => 'required|date|after_or_equal:today',
            'hora_cita' => 'required',
            'observaciones' => 'nullable|string'
        ]);

        // 2. Validación de Disponibilidad
        $existe = Cita::where('medico_id', $request->medico_id)
                      ->where('fecha_cita', $request->fecha_cita)
                      ->where('hora_cita', $request->hora_cita)
                      ->where('estado', '!=', 'cancelada')
                      ->exists();

        if ($existe) {
            return back()->withErrors(['hora_cita' => 'El médico ya tiene una cita agendada en ese horario.']);
        }

        // 3. CREAR LA CITA (Aquí estaba el error)
        $cita = Cita::create([
            'paciente_id' => $request->paciente_id, // <--- CORREGIDO: Usamos el ID del formulario, NO auth()->id()
            'medico_id' => $request->medico_id,
            'fecha_cita' => $request->fecha_cita,
            'hora_cita' => $request->hora_cita,
            'observaciones' => $request->observaciones,
            'estado' => 'pendiente'
        ]);

        // 4. Enviar correo al paciente real
        $paciente = User::find($request->paciente_id);
        
        if ($paciente) {
            Mail::to($paciente->email)->send(new CitaConfirmada($cita));
        }

        return redirect()->back()->with('success', 'Cita agendada y notificación enviada.');
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
}