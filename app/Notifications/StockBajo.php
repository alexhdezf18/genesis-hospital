<?php

namespace App\Notifications;

use App\Models\Medicamento;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class StockBajo extends Notification
{
    use Queueable;

    public $medicamento;

    public function __construct(Medicamento $medicamento)
    {
        $this->medicamento = $medicamento;
    }

    // Definimos los canales (database = se guarda en la tabla 'notifications')
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    // Estructura de los datos que guardaremos
    public function toArray(object $notifiable): array
    {
        return [
            'titulo' => 'Stock Crítico',
            'mensaje' => 'El medicamento ' . $this->medicamento->nombre . ' tiene pocas unidades (' . $this->medicamento->stock . ').',
            'accion' => route('medicamentos.index'), // Link para ir a verlo
            'icono' => 'pill', // Para ponerle un icono luego
            'color' => 'red'
        ];
    }
}