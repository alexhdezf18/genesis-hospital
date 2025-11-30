<?php

namespace App\Http\Controllers;

use App\Models\Medicamento;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MedicamentoController extends Controller
{
    public function index(Request $request)
    {
        // Búsqueda simple incluida
        $search = $request->input('search');

        $medicamentos = Medicamento::query()
            ->when($search, function ($query, $search) {
                $query->where('nombre', 'like', "%{$search}%")
                      ->orWhere('codigo', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Medicamentos', [
            'medicamentos' => $medicamentos,
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'codigo' => 'required|string|unique:medicamentos,codigo',
            'stock' => 'required|integer|min:0',
            'precio' => 'required|numeric|min:0',
            'laboratorio' => 'nullable|string',
            'fecha_vencimiento' => 'nullable|date',
        ]);

        Medicamento::create($request->all());

        return redirect()->back()->with('success', 'Medicamento agregado al inventario.');
    }
    
    // Aquí podríamos agregar update y destroy después
}