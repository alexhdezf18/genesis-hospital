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
        Schema::create('medicos', function (Blueprint $table) {
            $table->id();

            // Relación con la tabla users (Un médico ES un usuario)
            // onDelete('cascade') significa: si borro al usuario, se borra su perfil médico.
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            $table->string('specialty', 100); // Especialidad
            $table->string('license_number', 50)->unique(); // Cédula (Única)

            $table->text('bio')->nullable(); // Biografía corta para la web

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medicos');
    }
};
