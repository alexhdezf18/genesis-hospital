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
        Schema::create('medicamentos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre'); // Ej: Paracetamol 500mg
            $table->string('codigo')->unique(); // SKU o Código de barras
            $table->string('laboratorio')->nullable(); // Ej: Bayer, Genérico
            $table->integer('stock')->default(0); // Cantidad en almacén
            $table->decimal('precio', 10, 2); // Precio de venta (si lo vendieran)
            $table->date('fecha_vencimiento')->nullable(); // Control de caducidad
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medicamentos');
    }
};
