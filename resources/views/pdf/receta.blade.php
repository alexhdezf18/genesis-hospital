<!DOCTYPE html>
<html>
<head>
    <title>Receta Médica</title>
    <style>
        body { font-family: sans-serif; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #0056b3; padding-bottom: 10px; margin-bottom: 20px; }
        .header h1 { margin: 0; color: #0056b3; }
        .header p { margin: 2px; font-size: 12px; color: #666; }
        
        .info-box { width: 100%; margin-bottom: 20px; }
        .info-box td { padding: 5px; }
        .label { font-weight: bold; font-size: 12px; color: #555; text-transform: uppercase; }
        .value { font-size: 14px; }

        .section-title { background-color: #f0f8ff; padding: 5px 10px; font-weight: bold; border-left: 4px solid #0056b3; margin-bottom: 10px; }
        
        .content { margin-bottom: 30px; font-size: 14px; line-height: 1.6; }
        .rx-symbol { font-size: 24px; font-weight: bold; font-family: serif; color: #0056b3; margin-right: 10px; }

        .footer { position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #ddd; padding-top: 10px; }
        .signature { text-align: center; margin-top: 50px; }
        .signature-line { border-top: 1px solid #333; width: 200px; margin: 0 auto; }
    </style>
</head>
<body>

    <div class="header">
        <h1>GÉNESIS HOSPITAL</h1>
        <p>Av. Tecnológico 123, Chihuahua, Chih.</p>
        <p>Tel: (614) 555-0000 | Urgencias: (614) 555-9111</p>
    </div>

    <table class="info-box">
        <tr>
            <td width="50%">
                <div class="label">Paciente</div>
                <div class="value">{{ $historial->cita->paciente->name }}</div>
            </td>
            <td width="50%">
                <div class="label">Fecha de Consulta</div>
                <div class="value">{{ $historial->created_at->format('d/m/Y h:i A') }}</div>
            </td>
        </tr>
        <tr>
            <td>
                <div class="label">Médico Tratante</div>
                <div class="value">Dr. {{ $historial->medico->user->name }}</div>
                <div style="font-size: 10px;">Ced. Prof: {{ $historial->medico->license_number }}</div>
            </td>
            <td>
                <div class="label">Folio</div>
                <div class="value">#{{ str_pad($historial->id, 6, '0', STR_PAD_LEFT) }}</div>
            </td>
        </tr>
    </table>

    <div class="section-title">DIAGNÓSTICO</div>
    <div class="content">
        {{ $historial->diagnostico }}
    </div>

    <div class="section-title">TRATAMIENTO (Rx)</div>
    <div class="content">
        <span class="rx-symbol">℞</span>
        
        @if($historial->medicamentos->count() > 0)
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                <thead>
                    <tr style="background-color: #f0f0f0;">
                        <th style="text-align: left; padding: 5px; font-size: 12px; border-bottom: 1px solid #ccc;">Medicamento</th>
                        <th style="text-align: center; padding: 5px; font-size: 12px; border-bottom: 1px solid #ccc;">Cant.</th>
                        <th style="text-align: left; padding: 5px; font-size: 12px; border-bottom: 1px solid #ccc;">Indicación / Dosis</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($historial->medicamentos as $med)
                    <tr>
                        <td style="padding: 5px; border-bottom: 1px solid #eee; font-size: 12px;">
                            <strong>{{ $med->nombre }}</strong>
                            <br>
                            <span style="color: #666; font-size: 10px;">{{ $med->laboratorio }}</span>
                        </td>
                        <td style="text-align: center; padding: 5px; border-bottom: 1px solid #eee; font-size: 12px;">
                            {{ $med->pivot->cantidad }}
                        </td>
                        <td style="padding: 5px; border-bottom: 1px solid #eee; font-size: 12px; font-family: monospace;">
                            {{ $med->pivot->dosis }}
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        @endif

        <div style="margin-top: 10px;">
            <strong>Indicaciones Generales:</strong><br>
            {!! nl2br(e($historial->tratamiento)) !!}
        </div>
    </div>

    <div class="signature">
        <br><br><br>
        <div class="signature-line"></div>
        <p>Firma del Médico</p>
    </div>

    <div class="footer">
        Este documento es una representación impresa de una receta médica digital generada por el sistema Génesis Hospital.
    </div>

</body>
</html>