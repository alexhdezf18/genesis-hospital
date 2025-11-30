<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medicamento extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'codigo',
        'laboratorio',
        'stock',
        'precio',
        'fecha_vencimiento'
    ];
}