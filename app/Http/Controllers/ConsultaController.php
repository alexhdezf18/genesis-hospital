<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use App\Models\HistorialMedico;
use App\Models\Medicamento; // Asegúrate de importar el modelo
use App\Models\User;
use App\Notifications\StockBajo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class ConsultaController extends Controller
{
    // Mostrar la pantalla de atención (Formulario)
    public function create($cita_id)
    {
        $cita = Cita::with('paciente')->findOrFail($cita_id);
        
        $historialPrevio = HistorialMedico::with(['medico.user', 'medicamentos'])
            ->where('paciente_id', $cita->paciente_id)
            ->latest()
            ->get();

        $medicamentos = Medicamento::where('stock', '>', 0)->get();

        return Inertia::render('Medico/Atender', [
            'cita' => $cita,
            'historialPrevio' => $historialPrevio,
            'inventario' => $medicamentos
        ]);
    }

    // Guardar la consulta (Transacción)
    public function store(Request $request)
    {
        // 1. VALIDACIONES COMPLETAS (Agregué las que faltaban)
        $request->validate([
            'cita_id' => 'required|exists:citas,id',
            'sintomas' => 'required|string',
            'diagnostico' => 'required|string',
            'tratamiento' => 'required|string',
            // Signos Vitales
            'peso' => 'nullable|numeric|min:0|max:500',
            'altura' => 'nullable|numeric|min:0|max:3',
            'presion' => 'nullable|string|max:20',
            'temperatura' => 'nullable|numeric|min:30|max:45',
            'frecuencia_cardiaca' => 'nullable|integer|min:0|max:250',
            // Archivo y Receta
            'archivo' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'receta' => 'array|nullable',
            'receta.*.id' => 'exists:medicamentos,id',
            'receta.*.cantidad' => 'integer|min:1',
        ]);

        $cita = Cita::findOrFail($request->cita_id);

        DB::transaction(function () use ($request, $cita) {
            
            // 2. Guardar archivo
            $rutaArchivo = null;
            if ($request->hasFile('archivo')) {
                $rutaArchivo = $request->file('archivo')->store('historiales', 'public');
            }

            // 3. Crear Historial
            $historial = HistorialMedico::create([
                'cita_id' => $cita->id,
                'paciente_id' => $cita->paciente_id,
                'medico_id' => $cita->medico_id,
                'peso' => $request->peso,
                'altura' => $request->altura,
                'presion' => $request->presion,
                'temperatura' => $request->temperatura,
                'frecuencia_cardiaca' => $request->frecuencia_cardiaca,
                'sintomas' => $request->sintomas,
                'diagnostico' => $request->diagnostico,
                'tratamiento' => $request->tratamiento,
                'file_path' => $rutaArchivo,
            ]);

            // 4. PROCESAR MEDICAMENTOS (Lógica Unificada) 💊
            if (!empty($request->receta)) {
                foreach ($request->receta as $item) {
                    // Buscamos la medicina y bloqueamos para evitar concurrencia
                    $medicina = Medicamento::lockForUpdate()->find($item['id']);
                    
                    if ($medicina) {
                        $cantidad = (int) $item['cantidad'];

                        // Verificar stock disponible
                        if ($medicina->stock >= $cantidad) {
                            // A. Descontar y Guardar
                            $medicina->stock = $medicina->stock - $cantidad;
                            $medicina->save();

                            // B. Alerta de Stock Bajo (Si aplica)
                            if ($medicina->stock <= 10) {
                                $admins = User::where('role', 'admin')->get();
                                Notification::send($admins, new StockBajo($medicina));
                            }

                            // C. Guardar relación en historial
                            $historial->medicamentos()->attach($medicina->id, [
                                'cantidad' => $cantidad,
                                'dosis' => $item['dosis'] ?? 'Según indicaciones'
                            ]);
                        }
                    }
                }
            }

            // 5. Cerrar cita
            $cita->update(['estado' => 'completada']);
        });

        return redirect()->route('dashboard')->with('success', 'Consulta finalizada. Inventario actualizado.');
    }

    public function downloadPdf($id)
    {
        $historial = HistorialMedico::with(['cita.paciente', 'medico.user', 'medicamentos'])->findOrFail($id);
        $pdf = Pdf::loadView('pdf.receta', compact('historial'));
        return $pdf->stream('Receta-Folio-' . $id . '.pdf');
    }
}