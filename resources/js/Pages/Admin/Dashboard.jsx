import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react"; // Importamos Link aquí

export default function AdminDashboard({ auth, stats }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800">
                    Panel Administrativo
                </h2>
            }
        >
            <Head title="Admin" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* --- SECCIÓN 1: TARJETAS DE ESTADÍSTICAS --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* Tarjeta 1: Pacientes */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                            <div className="text-gray-500">
                                Pacientes Registrados
                            </div>
                            <div className="text-3xl font-bold text-gray-800">
                                {stats.pacientes}
                            </div>
                        </div>

                        {/* Tarjeta 2: Médicos */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
                            <div className="text-gray-500">Médicos Activos</div>
                            <div className="text-3xl font-bold text-gray-800">
                                {stats.medicos}
                            </div>
                        </div>

                        {/* Tarjeta 3: Citas */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
                            <div className="text-gray-500">Citas para Hoy</div>
                            <div className="text-3xl font-bold text-gray-800">
                                {stats.citas_hoy}
                            </div>
                        </div>
                    </div>

                    {/* --- SECCIÓN 2: ACCIONES RÁPIDAS--- */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-bold mb-4">
                                Bienvenido, {auth.user.name}
                            </h3>
                            <p className="mb-4">
                                Este es el nuevo panel de administración de alto
                                rendimiento. Desde aquí podrás gestionar toda la
                                clínica usando tecnología React.
                            </p>

                            {/* Botón usando Link de Inertia para navegación instantánea */}
                            <Link
                                href={route("users.index")}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out inline-block"
                            >
                                Gestionar Usuarios
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
