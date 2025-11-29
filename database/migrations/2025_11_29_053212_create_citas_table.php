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
        Schema::create('citas', function (Blueprint $table) {
            $table->id();
        
            // Relaciones: Un paciente (User) y un Médico (Medico)
            $table->foreignId('paciente_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('medico_id')->constrained('medicos')->onDelete('cascade');
        
            $table->date('fecha_cita');
            $table->time('hora_cita');
        
            // Estado de la cita (Enum es muy útil aquí)
            $table->enum('estado', ['pendiente', 'confirmada', 'cancelada', 'completada'])->default('pendiente');
        
            $table->text('observaciones')->nullable(); // Motivo de consulta
        
            $table->timestamps(); // Created_at y Updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('citas');
    }
};
