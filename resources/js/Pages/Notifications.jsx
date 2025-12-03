import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Notifications({ auth, notifications }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800">
                    Centro de Notificaciones
                </h2>
            }
        >
            <Head title="Notificaciones" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {notifications.length > 0 ? (
                            <ul className="divide-y divide-gray-200">
                                {notifications.map((notif) => (
                                    <li
                                        key={notif.id}
                                        className="p-4 hover:bg-gray-50 transition"
                                    >
                                        <div className="flex justify-between">
                                            <div className="flex gap-4">
                                                <div
                                                    className={`p-2 rounded-full h-10 w-10 flex items-center justify-center ${
                                                        notif.data.color ===
                                                        "red"
                                                            ? "bg-red-100 text-red-600"
                                                            : "bg-blue-100 text-blue-600"
                                                    }`}
                                                >
                                                    <i className="fas fa-exclamation-circle"></i>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">
                                                        {notif.data.titulo}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {notif.data.mensaje}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {new Date(
                                                            notif.created_at
                                                        ).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            {notif.data.accion && (
                                                <Link
                                                    href={notif.data.accion}
                                                    className="text-sm text-blue-600 hover:underline self-center"
                                                >
                                                    Ver →
                                                </Link>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-10 text-center text-gray-500">
                                No tienes notificaciones nuevas. 🔕
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
