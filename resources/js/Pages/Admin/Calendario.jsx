import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es"; // Idioma español
import { useState, useEffect } from "react";

export default function Calendario({ auth }) {
    const [events, setEvents] = useState([]);

    // Cargar eventos desde nuestra API al iniciar
    useEffect(() => {
        fetch(route("api.citas"))
            .then((response) => response.json())
            .then((data) => setEvents(data))
            .catch((error) => console.error("Error cargando citas:", error));
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800">
                    Agenda General Visual
                </h2>
            }
        >
            <Head title="Calendario" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        {/* Componente FullCalendar */}
                        <div className="calendar-container">
                            <FullCalendar
                                plugins={[
                                    dayGridPlugin,
                                    timeGridPlugin,
                                    interactionPlugin,
                                ]}
                                initialView="dayGridMonth"
                                headerToolbar={{
                                    left: "prev,next today",
                                    center: "title",
                                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                                }}
                                locale={esLocale} // Ponerlo en español
                                events={events} // Los datos que trajimos de Laravel
                                eventClick={(info) => {
                                    alert(
                                        "Paciente: " +
                                            info.event.title +
                                            "\nEstado: " +
                                            info.event.extendedProps.estado
                                    );
                                }}
                                height="auto"
                                aspectRatio={1.8}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Estilos CSS rápidos para arreglar botones del calendario */}
            <style>{`
                .fc-button-primary { background-color: #3b82f6 !important; border-color: #3b82f6 !important; }
                .fc-button-primary:hover { background-color: #2563eb !important; }
                .fc-event { cursor: pointer; }
            `}</style>
        </AuthenticatedLayout>
    );
}
