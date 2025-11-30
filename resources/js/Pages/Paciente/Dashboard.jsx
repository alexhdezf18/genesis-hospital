import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import { formatDate, formatTime } from "@/Utils/FormatDate";

export default function PacienteDashboard({ auth, proximasCitas, historial }) {
    const [activeTab, setActiveTab] = useState("citas");

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

            {/* SECCIÓN DE TÍTULO Y BOTÓN DE NUEVA CITA */}
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-6">
                <div className="flex justify-between items-center py-4 bg-white px-6 rounded-lg shadow-sm">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">
                            Bienvenido, {auth.user.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                            Gestiona tu salud desde aquí.
                        </p>
                    </div>

                    <Link
                        href={route("paciente.agendar")}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-700 transition flex items-center"
                    >
                        <span className="mr-2 text-xl">+</span> Nueva Cita
                    </Link>
                </div>
            </div>

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* TABS DE NAVEGACIÓN */}
                    <div className="flex border-b border-gray-200 mb-6 bg-white rounded-t-lg px-4 pt-2">
                        <button
                            className={`py-3 px-6 font-semibold focus:outline-none border-b-4 transition ${
                                activeTab === "citas"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                            onClick={() => setActiveTab("citas")}
                        >
                            📅 Próximas Citas
                        </button>
                        <button
                            className={`py-3 px-6 font-semibold focus:outline-none border-b-4 transition ${
                                activeTab === "historial"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                            onClick={() => setActiveTab("historial")}
                        >
                            📂 Historial y Recetas
                        </button>
                    </div>

                    {/* CONTENIDO: PESTAÑA CITAS */}
                    {activeTab === "citas" && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                                Tus citas programadas
                            </h3>
                            {proximasCitas.length > 0 ? (
                                <div className="grid gap-4 md:grid-cols-2">
                                    {proximasCitas.map((cita) => (
                                        <div
                                            key={cita.id}
                                            className="border rounded-lg p-4 flex justify-between items-center bg-blue-50 border-blue-100 hover:shadow-md transition"
                                        >
                                            <div>
                                                <div className="text-sm text-blue-600 font-bold uppercase">
                                                    {formatDate(
                                                        cita.fecha_cita
                                                    )}
                                                </div>
                                                <div className="text-2xl font-bold text-gray-800">
                                                    {formatTime(cita.hora_cita)}
                                                </div>
                                                <div className="text-gray-600 mt-1 font-medium">
                                                    Dr. {cita.medico.user.name}
                                                </div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wide">
                                                    {cita.medico.specialty}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span
                                                    className={`px-3 py-1 text-xs rounded-full font-bold ${
                                                        cita.estado ===
                                                        "confirmada"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                                >
                                                    {cita.estado.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-gray-50 rounded border border-dashed border-gray-300">
                                    <p className="text-gray-500 italic mb-2">
                                        No tienes citas próximas. ¡Estás al día!
                                    </p>
                                    <Link
                                        href={route("paciente.agendar")}
                                        className="text-blue-600 font-bold hover:underline"
                                    >
                                        ¿Quieres agendar una ahora?
                                    </Link>
                                </div>
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
                                            <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-2">
                                                <div>
                                                    <h4 className="text-lg font-bold text-gray-900">
                                                        Consulta General
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        Atendido por:{" "}
                                                        <span className="font-semibold text-gray-700">
                                                            Dr.{" "}
                                                            {
                                                                registro.medico
                                                                    .user.name
                                                            }
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className="text-right text-gray-500 text-sm">
                                                    Fecha:{" "}
                                                    {formatDate(
                                                        registro.created_at
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                                                    <strong className="text-indigo-600 block mb-2 text-xs uppercase tracking-wider">
                                                        Diagnóstico
                                                    </strong>
                                                    <p className="text-gray-800 text-sm">
                                                        {registro.diagnostico}
                                                    </p>
                                                </div>
                                                <div className="bg-green-50 p-4 rounded border border-green-100">
                                                    <strong className="text-green-700 block mb-2 text-xs uppercase tracking-wider">
                                                        📋 Receta / Tratamiento
                                                    </strong>
                                                    <p className="text-gray-800 whitespace-pre-wrap font-mono text-sm">
                                                        {registro.tratamiento}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* --- BARRA DE ACCIONES (BOTONES) --- */}
                                            <div className="mt-4 flex justify-end items-center gap-3 border-t border-gray-100 pt-4">
                                                [cite_start]
                                                {/* 1. Botón para ver archivo adjunto (Si existe) [cite: 26] */}
                                                {registro.file_path && (
                                                    <a
                                                        href={`/storage/${registro.file_path}`}
                                                        target="_blank"
                                                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center font-medium"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4 mr-1"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                                            />
                                                        </svg>
                                                        Ver Estudios Adjuntos
                                                    </a>
                                                )}
                                                [cite_start]
                                                {/* 2. Botón para descargar PDF [cite: 25] */}
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
                                            {/* ----------------------------------- */}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white p-12 rounded shadow text-center text-gray-400">
                                    <svg
                                        className="w-16 h-16 mx-auto mb-4 text-gray-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        ></path>
                                    </svg>
                                    <p className="text-lg">
                                        No hay historial médico registrado aún.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
