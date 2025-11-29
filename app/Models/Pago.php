<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pago extends Model
{
    use HasFactory;

    protected $fillable = ['cita_id', 'monto', 'metodo_pago'];

    public function cita()
    {
        return $this->belongsTo(Cita::class);
    }
}