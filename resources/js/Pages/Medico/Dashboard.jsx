import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { formatDate, formatTime } from "@/Utils/FormatDate";

export default function MedicoDashboard({ auth, citas }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800">
                    Mi Agenda Médica
                </h2>
            }
        >
            <Head title="Médico" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Tarjeta de Bienvenida */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-5 w-5 text-blue-400"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-blue-700">
                                    Tienes{" "}
                                    <span className="font-bold">
                                        {citas.length}
                                    </span>{" "}
                                    pacientes esperando atención.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de Citas */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {citas.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Hora
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Paciente
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Motivo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acción
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {citas.map((cita) => (
                                        <tr key={cita.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                {formatDate(cita.fecha_cita)}{" "}
                                                <br /> {cita.hora_cita}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {cita.paciente.name}
                                                <div className="text-xs text-gray-400">
                                                    {cita.paciente.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {cita.observaciones || (
                                                    <span className="italic text-gray-300">
                                                        Sin especificar
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link
                                                    href={route(
                                                        "consulta.create",
                                                        cita.id
                                                    )}
                                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-xs transition inline-block"
                                                >
                                                    ATENDER
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-12 text-center text-gray-500">
                                <p className="text-xl">
                                    No hay citas programadas ☕
                                </p>
                                <p className="text-sm">
                                    Disfruta tu café, doctor.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
