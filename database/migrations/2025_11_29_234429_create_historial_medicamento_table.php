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
        Schema::create('historial_medicamento', function (Blueprint $table) {
            $table->id();

           // Llaves foráneas
            $table->foreignId('historial_medico_id')->constrained()->onDelete('cascade');
            $table->foreignId('medicamento_id')->constrained()->onDelete('cascade');

            // Datos de la prescripción
            $table->integer('cantidad'); // Ej: 2 cajas
            $table->string('dosis');     // Ej: "1 tableta cada 8 horas"

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historial_medicamento');
    }
};
