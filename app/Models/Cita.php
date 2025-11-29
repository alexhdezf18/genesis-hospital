<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cita extends Model
{
    use HasFactory;

    protected $fillable = [
        'paciente_id',
        'medico_id',
        'fecha_cita',
        'hora_cita',
        'estado',
        'observaciones'
    ];

    // Relación: Una cita pertenece a un Paciente (User)
    public function paciente()
    {
        return $this->belongsTo(User::class, 'paciente_id');
    }

    // Relación: Una cita pertenece a un Médico
    public function medico()
    {
        return $this->belongsTo(Medico::class, 'medico_id');
    }

    public function pago()
    {
        return $this->hasOne(Pago::class);
    }
}