<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use App\Models\HistorialMedico;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Medicamento;

class ConsultaController extends Controller
{
    // Mostrar la pantalla de atención (Formulario)
    public function create($cita_id)
    {
        $cita = Cita::with('paciente')->findOrFail($cita_id);
        
        $historialPrevio = HistorialMedico::with(['medico.user', 'medicamentos']) // <-- Ojo: traemos medicamentos previos también
            ->where('paciente_id', $cita->paciente_id)
            ->latest()
            ->get();

        // Traemos solo medicamentos con stock disponible
        $medicamentos = Medicamento::where('stock', '>', 0)->get();

        return Inertia::render('Medico/Atender', [
            'cita' => $cita,
            'historialPrevio' => $historialPrevio,
            'inventario' => $medicamentos // <--- Enviamos esto a React
        ]);
    }

    // 2. Guardar la consulta (Transacción)
    public function store(Request $request)
    {
        // Validamos también el array de medicinas (si existe)
        $request->validate([
            'cita_id' => 'required|exists:citas,id',
            'sintomas' => 'required|string',
            'diagnostico' => 'required|string',
            'tratamiento' => 'required|string', // Instrucciones generales
            'receta' => 'array|nullable', // Lista de medicinas seleccionadas
            'receta.*.id' => 'exists:medicamentos,id',
            'receta.*.cantidad' => 'integer|min:1',
        ]);

        $cita = Cita::findOrFail($request->cita_id);

        DB::transaction(function () use ($request, $cita) {
            
            // 1. Guardar archivo (igual que antes)
            $rutaArchivo = null;
            if ($request->hasFile('archivo')) {
                $rutaArchivo = $request->file('archivo')->store('historiales', 'public');
            }

            // 2. Crear Historial
            $historial = HistorialMedico::create([
                'cita_id' => $cita->id,
                'paciente_id' => $cita->paciente_id,
                'medico_id' => $cita->medico_id,
                'sintomas' => $request->sintomas,
                'diagnostico' => $request->diagnostico,
                'tratamiento' => $request->tratamiento,
                'file_path' => $rutaArchivo,
            ]);

            // 3. PROCESAR MEDICAMENTOS 💊
            if (!empty($request->receta)) {
                foreach ($request->receta as $item) {
                    // Buscamos la medicina
                    $medicina = Medicamento::find($item['id']);
                    
                    if ($medicina) {
                        // Forzamos que sean números enteros
                        $cantidadSolicitada = (int) $item['cantidad'];
                        $stockActual = (int) $medicina->stock;

                        if ($stockActual >= $cantidadSolicitada) {
                            // OPCIÓN A: Usar decrement (La elegante)
                            // $medicina->decrement('stock', $cantidadSolicitada);

                            // OPCIÓN B: Manual (La infalible)
                            $medicina->stock = $stockActual - $cantidadSolicitada;
                            $medicina->save(); // <--- Guardamos explícitamente

                            // Guardar en tabla intermedia
                            $historial->medicamentos()->attach($medicina->id, [
                                'cantidad' => $cantidadSolicitada,
                                'dosis' => $item['dosis'] ?? 'Según indicaciones'
                            ]);
                        }
                    }
                }
            }

            // 4. Cerrar cita
            $cita->update(['estado' => 'completada']);
        });

        return redirect()->route('dashboard')->with('success', 'Consulta finalizada. Inventario actualizado.');
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