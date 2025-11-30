<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f7f6; padding: 20px; }
        .card { background-color: white; max-width: 600px; margin: 0 auto; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 20px; }
        .header h1 { color: #1e3a8a; margin: 0; }
        .info { margin-bottom: 20px; }
        .info p { margin: 5px 0; color: #555; }
        .highlight { color: #3b82f6; font-weight: bold; font-size: 18px; }
        .footer { text-align: center; font-size: 12px; color: #999; margin-top: 30px; }
        .btn { display: inline-block; background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h1>Génesis Hospital</h1>
            <p>Confirmación de Agendamiento</p>
        </div>

        <p>Hola, <strong>{{ $cita->paciente->name }}</strong>.</p>
        <p>Tu cita médica ha sido agendada exitosamente. Aquí están los detalles:</p>

        <div class="info" style="background-color: #eff6ff; padding: 15px; border-radius: 5px;">
            <p>👨‍⚕️ <strong>Médico:</strong> Dr. {{ $cita->medico->user->name }}</p>
            <p>🩺 <strong>Especialidad:</strong> {{ $cita->medico->specialty }}</p>
            <hr style="border: 0; border-top: 1px solid #dbeafe;">
            <p>📅 <strong>Fecha:</strong> <span class="highlight">{{ $cita->fecha_cita }}</span></p>
            <p>⏰ <strong>Hora:</strong> <span class="highlight">{{ $cita->hora_cita }}</span></p>
        </div>

        <p>Por favor, llega 15 minutos antes de tu hora programada.</p>

        <div style="text-align: center;">
            <a href="{{ url('/login') }}" class="btn">Ver en mi Portal</a>
        </div>

        <div class="footer">
            <p>Si necesitas cancelar, por favor contáctanos al (614) 555-0000.</p>
            <p>© {{ date('Y') }} Génesis Hospital. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>