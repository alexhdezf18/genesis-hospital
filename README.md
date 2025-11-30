# 🏥 Génesis Hospital - Sistema de Gestión Clínica Integral

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Laravel](https://img.shields.io/badge/backend-Laravel%2011-red)
![React](https://img.shields.io/badge/frontend-React%2018-blue)
![Inertia](https://img.shields.io/badge/adapter-Inertia.js-purple)
![Tailwind](https://img.shields.io/badge/style-Tailwind%20CSS-teal)

Plataforma SaaS (Software as a Service) diseñada para la administración moderna de clínicas y hospitales. Integra flujos operativos, médicos y financieros en una interfaz reactiva de alto rendimiento.

---

## 🚀 Características Principales

### 👨‍💼 Panel Administrativo (Business Intelligence)

-   **Dashboard en Tiempo Real:** KPIs de pacientes, médicos e ingresos financieros.
-   **Gráficas Interactivas:** Visualización de tendencias de ingresos y operatividad (Chart.js).
-   **Gestión de Usuarios:** CRUD completo con asignación de roles y perfiles profesionales.

### 🗓️ Gestión de Citas y Agenda

-   **Calendario Visual:** Interfaz interactiva (FullCalendar) para visualizar la ocupación mensual/semanal.
-   **Validación de Conflictos:** El sistema impide agendar citas dobles automáticamente.
-   **Notificaciones:** Envío automático de correos de confirmación al paciente.

### 🩺 Módulo Médico (HCE)

-   **Expediente Clínico Electrónico:** Historial completo del paciente accesible durante la consulta.
-   **Consulta Digital:** Registro de anamnesis, diagnóstico (CIE-10) y tratamiento.
-   **Archivos Adjuntos:** Capacidad para subir y visualizar estudios de laboratorio o radiografías.

### 👤 Portal del Paciente

-   **Autogestión:** Agendamiento de citas sin intermediarios.
-   **Historial y Recetas:** Acceso a diagnósticos previos y descarga de **Recetas Médicas en PDF** oficiales.

### 💰 Finanzas y Caja

-   **Control de Ingresos:** Registro de pagos por consulta (Efectivo/Tarjeta).
-   **Reportes:** Tablas de corte de caja exportables.

---

## 🛠️ Stack Tecnológico

Este proyecto utiliza una arquitectura **Monolítica Moderna** (Modular Monolith) optimizada para velocidad de desarrollo y experiencia de usuario SPA (Single Page Application).

-   **Backend:** PHP 8.2+, Laravel 11.
-   **Frontend:** React.js, Tailwind CSS.
-   **Comunicación:** Inertia.js (Evita la complejidad de una API REST completa).
-   **Base de Datos:** MySQL 8.0.
-   **Infraestructura Local:** Docker (Laravel Sail).
-   **Extras:** DomPDF (Reportes), Chart.js (Gráficas), Mailpit (Testing de Correos).

---

## 💻 Instalación y Despliegue Local

Sigue estos pasos para levantar el proyecto en tu entorno local usando Docker.

### Prerrequisitos

-   Docker Desktop instalado y corriendo.
-   Git.

### Pasos

1.  **Clonar el repositorio**

    ```bash
    git clone [https://github.com/TU_USUARIO/genesis-hospital.git](https://github.com/TU_USUARIO/genesis-hospital.git)
    cd genesis-hospital
    ```

2.  **Instalar dependencias de Backend**

    ```bash
    docker run --rm \
        -u "$(id -u):$(id -g)" \
        -v "$(pwd):/var/www/html" \
        -w /var/www/html \
        laravelsail/php8.3-composer:latest \
        composer install --ignore-platform-reqs
    ```

3.  **Configurar entorno**

    ```bash
    cp .env.example .env
    # Ajustar DB_HOST=mysql y DB_PASSWORD=password en el archivo .env si es necesario
    ```

4.  **Levantar Contenedores**

    ```bash
    ./vendor/bin/sail up -d
    ```

5.  **Generar llave y Base de Datos (Semilla)**

    ```bash
    ./vendor/bin/sail artisan key:generate
    ./vendor/bin/sail artisan migrate:fresh --seed
    ```

6.  **Instalar dependencias de Frontend y Compilar**

    ```bash
    npm install
    npm run dev
    ```

7.  **¡Listo!**
    Accede a: `http://localhost:8085`

---

## 🔐 Credenciales de Prueba

El sistema incluye datos semilla (`DatabaseSeeder`) para pruebas rápidas:

| Rol               | Email                | Password   |
| :---------------- | :------------------- | :--------- |
| **Admin**         | `admin@hospital.com` | `password` |
| **Médico**        | `house@hospital.com` | `password` |
| **Recepcionista** | `ana@hospital.com`   | `password` |
| **Paciente**      | `pepe@gmail.com`     | `password` |

---

## 📄 Licencia

Este proyecto es de código abierto bajo la licencia [MIT](https://opensource.org/licenses/MIT).
