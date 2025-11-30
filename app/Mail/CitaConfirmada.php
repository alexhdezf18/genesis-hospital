<?php

namespace App\Mail;

use App\Models\Cita;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CitaConfirmada extends Mailable
{
    use Queueable, SerializesModels;

    public $cita; // Variable pública para usarla en la vista

    // Recibimos la Cita en el constructor
    public function __construct(Cita $cita)
    {
        $this->cita = $cita;
    }

    // Asunto del correo
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Confirmación de Cita - Génesis Hospital',
        );
    }

    // Definimos qué vista (diseño) usar
    public function content(): Content
    {
        return new Content(
            view: 'emails.cita_confirmada',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}