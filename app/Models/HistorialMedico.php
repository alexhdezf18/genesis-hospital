<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistorialMedico extends Model
{
    use HasFactory;

    protected $fillable = [
        'cita_id',
        'paciente_id',
        'medico_id',
        'peso',
        'altura',
        'presion',
        'temperatura',
        'frecuencia_cardiaca',
        'sintomas',
        'diagnostico',
        'tratamiento',
        'file_path',
    ];

    // Relación con la Cita original
    public function cita()
    {
        return $this->belongsTo(Cita::class);
    }

    // Relación con el Médico que lo atendió
    public function medico()
    {
        return $this->belongsTo(Medico::class);
    }

    // Relación Muchos a Muchos con Medicamentos
    public function medicamentos()
    {
        return $this->belongsToMany(Medicamento::class, 'historial_medicamento')
            ->withPivot('cantidad', 'dosis')
            ->withTimestamps();
    }
}
