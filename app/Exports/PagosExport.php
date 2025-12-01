<?php

namespace App\Exports;

use App\Models\Pago;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class PagosExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        // Traemos todos los pagos con sus relaciones
        return Pago::with(['cita.paciente', 'cita.medico.user'])->latest()->get();
    }

    // Definir los encabezados de las columnas en Excel
    public function headings(): array
    {
        return [
            'ID Pago',
            'Fecha',
            'Paciente',
            'Médico Tratante',
            'Método Pago',
            'Monto ($)',
        ];
    }

    // Mapear cada fila de datos
    public function map($pago): array
    {
        return [
            $pago->id,
            $pago->created_at->format('d/m/Y H:i'),
            $pago->cita->paciente->name . ' ' . $pago->cita->paciente->apellidos,
            $pago->cita->medico->user->name,
            ucfirst($pago->metodo_pago),
            $pago->monto,
        ];
    }
}