<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use App\Models\HistorialMedico;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\HistorialMedico;

class ConsultaController extends Controller
{
    // 1. Mostrar la pantalla de atención (Formulario)
    public function create($cita_id)
    {
        // Buscamos la cita y cargamos datos del paciente
        $cita = Cita::with('paciente')->findOrFail($cita_id);

        // TODO: Aquí podrías agregar validación para que solo EL médico dueño la vea

        return Inertia::render('Medico/Atender', [
            'cita' => $cita
        ]);
    }

    // 2. Guardar la consulta (Transacción)
    public function store(Request $request)
    {
        $request->validate([
            'cita_id' => 'required|exists:citas,id',
            'sintomas' => 'required|string',
            'diagnostico' => 'required|string',
            'tratamiento' => 'required|string',
        ]);

        $cita = Cita::findOrFail($request->cita_id);

        DB::transaction(function () use ($request, $cita) {
            // A. Crear el historial médico
            HistorialMedico::create([
                'cita_id' => $cita->id,
                'paciente_id' => $cita->paciente_id,
                'medico_id' => $cita->medico_id,
                'sintomas' => $request->sintomas,
                'diagnostico' => $request->diagnostico,
                'tratamiento' => $request->tratamiento,
            ]);

            // B. Marcar la cita como completada
            $cita->update(['estado' => 'completada']);
        });

        return redirect()->route('dashboard')->with('success', 'Consulta finalizada con éxito.');
    }

    public function downloadPdf($id)
    {
        // 1. Buscar el historial con todas sus relaciones
        $historial = HistorialMedico::with(['cita.paciente', 'medico.user'])->findOrFail($id);

        // TODO: Aquí podrías validar que solo el paciente dueño o el médico puedan descargarlo

        // 2. Cargar la vista Blade y pasarle los datos
        $pdf = Pdf::loadView('pdf.receta', compact('historial'));

        // 3. Descargar el archivo (stream para ver en navegador, download para bajar directo)
        return $pdf->stream('Receta-Folio-' . $id . '.pdf');
    }
}