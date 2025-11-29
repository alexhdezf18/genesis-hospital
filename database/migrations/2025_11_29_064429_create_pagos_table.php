<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pagos', function (Blueprint $table) {
            $table->id();
            // Una cita solo se paga una vez (unique)
            $table->foreignId('cita_id')->unique()->constrained('citas')->onDelete('cascade');

            $table->decimal('monto', 10, 2); // 10 dígitos, 2 decimales (ej: 1500.00)
            $table->enum('metodo_pago', ['efectivo', 'tarjeta', 'transferencia']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pagos');
    }
};
