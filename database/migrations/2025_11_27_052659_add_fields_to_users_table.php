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
        Schema::table('users', function (Blueprint $table) {
            // 1. ROL: Usamos un ENUM para restringir los tipos de usuario
            $table->enum('role', ['admin', 'medico', 'paciente', 'recepcionista'])
                  ->default('paciente') // Por defecto, quien se registre es paciente
                  ->after('email');     // Orden visual en la BD

            // 2. TELÉFONO: Vital para recordatorios de WhatsApp
            $table->string('phone', 20)->nullable()->after('password');

            // 3. ESTATUS: Para poder banear usuarios sin borrarlos
            $table->boolean('is_active')->default(true)->after('role');

            // 4. SOFT DELETES: Papelera de reciclaje automática
            $table->softDeletes(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'phone', 'is_active']);
            $table->dropSoftDeletes();
        });
    }
};
