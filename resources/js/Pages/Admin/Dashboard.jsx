import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

// Registrar componentes de ChartJS
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function AdminDashboard({ auth, stats, charts }) {
    // Configuración Gráfica de Líneas (Ingresos)
    const lineData = {
        labels: charts.ingresos.labels,
        datasets: [
            {
                label: "Ingresos ($)",
                data: charts.ingresos.data,
                borderColor: "rgb(59, 130, 246)", // Azul Tailwind
                backgroundColor: "rgba(59, 130, 246, 0.5)",
                tension: 0.3, // Curvatura suave
            },
        ],
    };

    const lineOptions = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Tendencia de Ingresos (7 Días)" },
        },
    };

    // Configuración Gráfica de Dona (Estados)
    const doughnutData = {
        labels: ["Pendiente", "Confirmada", "Completada", "Cancelada"],
        datasets: [
            {
                data: [
                    charts.estados.pendiente,
                    charts.estados.confirmada,
                    charts.estados.completada,
                    charts.estados.cancelada,
                ],
                backgroundColor: [
                    "#f59e0b", // Amarillo
                    "#3b82f6", // Azul
                    "#10b981", // Verde
                    "#ef4444", // Rojo
                ],
                borderWidth: 1,
            },
        ],
    };

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
                    {/* TARJETAS DE NÚMEROS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                            <div className="text-gray-500 font-medium">
                                Pacientes Registrados
                            </div>
                            <div className="text-3xl font-bold text-gray-800">
                                {stats.pacientes}
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
                            <div className="text-gray-500 font-medium">
                                Médicos Activos
                            </div>
                            <div className="text-3xl font-bold text-gray-800">
                                {stats.medicos}
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
                            <div className="text-gray-500 font-medium">
                                Citas Hoy
                            </div>
                            <div className="text-3xl font-bold text-gray-800">
                                {stats.citas_hoy}
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN DE GRÁFICAS */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        {/* Gráfica Principal (2 columnas de ancho) */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                            <Line options={lineOptions} data={lineData} />
                        </div>

                        {/* Gráfica Secundaria (1 columna de ancho) */}
                        <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center justify-center">
                            <h3 className="text-gray-600 font-bold mb-4">
                                Resumen Operativo
                            </h3>
                            <div className="w-full max-w-xs">
                                <Doughnut data={doughnutData} />
                            </div>
                        </div>
                    </div>

                    {/* ACCIONES RÁPIDAS */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold">
                                    Gestión del Sistema
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Administra usuarios, médicos y reportes
                                    desde aquí.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                {/* 1. Botón Descargar Excel */}
                                <a
                                    href={route("reportes.excel")}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow flex items-center transition"
                                >
                                    <span className="mr-2">📊</span> Descargar
                                    Excel
                                </a>

                                <Link
                                    href={route("users.index")}
                                    className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition"
                                >
                                    Ir a Usuarios →
                                </Link>
                            </div>
                            {/* ---------------------------------- */}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
