<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use App\Models\HistorialMedico;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class ConsultaController extends Controller
{
    // Mostrar la pantalla de atención (Formulario)
    public function create($cita_id)
    {
        // Buscamos la cita actual
        $cita = Cita::with('paciente')->findOrFail($cita_id);

        // Buscamos el historial ANTERIOR de este paciente
        // Traemos también el nombre del médico que lo atendió esa vez
        $historialPrevio = HistorialMedico::with('medico.user')
            ->where('paciente_id', $cita->paciente_id)
            ->latest() // Del más reciente al más antiguo
            ->get();

        return Inertia::render('Medico/Atender', [
            'cita' => $cita,
            'historialPrevio' => $historialPrevio // Enviamos la variable a React
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
            'archivo' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048', // Validación de archivo (Max 2MB)
        ]);

        $cita = Cita::findOrFail($request->cita_id);

        DB::transaction(function () use ($request, $cita) {
            
            // 1. Manejo del Archivo
            $rutaArchivo = null;
            if ($request->hasFile('archivo')) {
                // Guardar en la carpeta 'historiales' dentro del disco 'public'
                $rutaArchivo = $request->file('archivo')->store('historiales', 'public');
            }

            // 2. Crear historial con el archivo
            HistorialMedico::create([
                'cita_id' => $cita->id,
                'paciente_id' => $cita->paciente_id,
                'medico_id' => $cita->medico_id,
                'sintomas' => $request->sintomas,
                'diagnostico' => $request->diagnostico,
                'tratamiento' => $request->tratamiento,
                'file_path' => $rutaArchivo, // <--- Guardamos la ruta
            ]);

            // 3. Cerrar cita
            $cita->update(['estado' => 'completada']);
        });

        return redirect()->route('dashboard')->with('success', 'Consulta finalizada y archivo guardado.');
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