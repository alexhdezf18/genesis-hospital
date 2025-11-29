<?php

namespace App\Http\Controllers;

use App\Models\Pago;
use Illuminate\Http\Request;

class PagoController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'cita_id' => 'required|exists:citas,id|unique:pagos,cita_id',
            'monto' => 'required|numeric|min:0',
            'metodo_pago' => 'required|in:efectivo,tarjeta,transferencia',
        ]);

        Pago::create($request->all());

        return redirect()->back()->with('success', 'Pago registrado exitosamente. 💰');
    }
}