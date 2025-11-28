<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Medico;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Crear el ADMINISTRADOR
        User::create([
            'name' => 'Alex Admin',
            'email' => 'admin@hospital.com',
            'password' => Hash::make('password'), // Hash::make encripta la contraseña
            'role' => 'admin',
            'is_active' => true,
        ]);

        // 2. Crear el RECEPCIONISTA
        User::create([
            'name' => 'Ana Recepción',
            'email' => 'ana@hospital.com',
            'password' => Hash::make('password'),
            'role' => 'recepcionista',
            'is_active' => true,
        ]);

        // 3. Crear MÉDICO 1 (Dr. House)
        // Primero creamos el usuario
        $medico1 = User::create([
            'name' => 'Dr. Gregory House',
            'email' => 'house@hospital.com',
            'password' => Hash::make('password'),
            'role' => 'medico',
            'is_active' => true,
        ]);
        
        // Luego creamos su perfil médico vinculado
        Medico::create([
            'user_id' => $medico1->id,
            'specialty' => 'Diagnóstico',
            'license_number' => 'MED-998877',
            'bio' => 'Especialista en enfermedades infecciosas y nefrología. Un poco gruñón.'
        ]);

        // 4. Crear MÉDICO 2 (Dra. Strange)
        $medico2 = User::create([
            'name' => 'Dra. Stephenie Strange',
            'email' => 'strange@hospital.com',
            'password' => Hash::make('password'),
            'role' => 'medico',
            'is_active' => true,
        ]);

        Medico::create([
            'user_id' => $medico2->id,
            'specialty' => 'Cirugía',
            'license_number' => 'MED-112233',
            'bio' => 'La mejor cirujana del hospital.'
        ]);

        // 5. Crear un PACIENTE de prueba
        User::create([
            'name' => 'Pepe Paciente',
            'email' => 'pepe@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'paciente',
            'phone' => '555-123-4567',
            'is_active' => true,
        ]);
    }
} 