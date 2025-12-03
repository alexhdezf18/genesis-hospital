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
        Schema::table('historial_medicos', function (Blueprint $table) {
            // Agregamos campos médicos estándar
            $table->decimal('peso', 5, 2)->nullable()->after('medico_id'); // Ej: 75.50 kg
            $table->decimal('altura', 3, 2)->nullable()->after('peso');    // Ej: 1.80 m
            $table->string('presion', 20)->nullable()->after('altura');    // Ej: "120/80"
            $table->decimal('temperatura', 4, 1)->nullable()->after('presion'); // Ej: 36.5
            $table->integer('frecuencia_cardiaca')->nullable()->after('temperatura'); // Ej: 80 bpm
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('historial_medicos', function (Blueprint $table) {
            $table->dropColumn(['peso', 'altura', 'presion', 'temperatura', 'frecuencia_cardiaca']);
        });
    }
};
