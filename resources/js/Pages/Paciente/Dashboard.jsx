import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";

export default function PacienteDashboard({ auth, proximasCitas, historial }) {
    const [activeTab, setActiveTab] = useState("citas"); // Controla qué pestaña vemos

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800">
                    Mi Portal de Salud
                </h2>
            }
        >
            <Head title="Paciente" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* TABS DE NAVEGACIÓN */}
                    <div className="flex border-b border-gray-200 mb-6">
                        <button
                            className={`py-2 px-6 font-semibold focus:outline-none ${
                                activeTab === "citas"
                                    ? "border-b-4 border-blue-500 text-blue-600"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                            onClick={() => setActiveTab("citas")}
                        >
                            📅 Próximas Citas
                        </button>
                        <button
                            className={`py-2 px-6 font-semibold focus:outline-none ${
                                activeTab === "historial"
                                    ? "border-b-4 border-blue-500 text-blue-600"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                            onClick={() => setActiveTab("historial")}
                        >
                            📂 Historial y Recetas
                        </button>
                    </div>

                    {/* CONTENIDO: PESTAÑA CITAS */}
                    {activeTab === "citas" && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">
                                Tus citas programadas
                            </h3>
                            {proximasCitas.length > 0 ? (
                                <div className="grid gap-4 md:grid-cols-2">
                                    {proximasCitas.map((cita) => (
                                        <div
                                            key={cita.id}
                                            className="border rounded-lg p-4 flex justify-between items-center bg-blue-50 border-blue-100"
                                        >
                                            <div>
                                                <div className="text-sm text-blue-600 font-bold uppercase">
                                                    {cita.fecha_cita}
                                                </div>
                                                <div className="text-2xl font-bold text-gray-800">
                                                    {cita.hora_cita}
                                                </div>
                                                <div className="text-gray-600 mt-1">
                                                    Dr. {cita.medico.user.name}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {cita.medico.specialty}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 font-bold">
                                                    {cita.estado.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">
                                    No tienes citas próximas. ¡Estás al día!
                                </p>
                            )}
                        </div>
                    )}

                    {/* CONTENIDO: PESTAÑA HISTORIAL */}
                    {activeTab === "historial" && (
                        <div className="space-y-6">
                            {historial.length > 0 ? (
                                historial.map((registro) => (
                                    <div
                                        key={registro.id}
                                        className="bg-white overflow-hidden shadow-sm sm:rounded-lg border-l-4 border-green-500"
                                    >
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="text-lg font-bold text-gray-900">
                                                        Consulta General
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        Atendido por: Dr.{" "}
                                                        {
                                                            registro.medico.user
                                                                .name
                                                        }
                                                    </p>
                                                </div>
                                                <div className="text-right text-gray-500 text-sm">
                                                    Fecha:{" "}
                                                    {
                                                        registro.created_at.split(
                                                            "T"
                                                        )[0]
                                                    }
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="bg-gray-50 p-3 rounded">
                                                    <strong className="text-indigo-600 block mb-1">
                                                        Diagnóstico:
                                                    </strong>
                                                    <p className="text-gray-800">
                                                        {registro.diagnostico}
                                                    </p>
                                                </div>
                                                <div className="bg-green-50 p-3 rounded border border-green-100">
                                                    <strong className="text-green-700 block mb-1">
                                                        📋 Receta / Tratamiento:
                                                    </strong>
                                                    <p className="text-gray-800 whitespace-pre-wrap font-mono text-sm">
                                                        {registro.tratamiento}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* --- AQUÍ AGREGAMOS EL BOTÓN DE PDF --- */}
                                            <div className="mt-4 flex justify-end border-t border-gray-100 pt-4">
                                                <a
                                                    href={route(
                                                        "receta.pdf",
                                                        registro.id
                                                    )}
                                                    target="_blank"
                                                    className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 active:bg-red-700 focus:outline-none transition ease-in-out duration-150 shadow-sm"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4 mr-2"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                        />
                                                    </svg>
                                                    Descargar Receta PDF
                                                </a>
                                            </div>
                                            {/* -------------------------------------- */}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white p-6 rounded shadow text-center text-gray-500">
                                    No hay historial médico registrado aún.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
