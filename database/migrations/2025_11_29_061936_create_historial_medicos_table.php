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
        Schema::create('historial_medicos', function (Blueprint $table) {
            $table->id();
            // Vinculamos todo: Cita, Paciente y Médico
            $table->foreignId('cita_id')->unique()->constrained('citas')->onDelete('cascade');
            $table->foreignId('paciente_id')->constrained('users');
            $table->foreignId('medico_id')->constrained('medicos');

            $table->text('sintomas');    // Motivo/Síntomas
            $table->text('diagnostico'); // El dictamen médico
            $table->text('tratamiento'); // La receta/instrucciones

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historial_medicos');
    }
};
