import { Link, Head } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Bienvenido" />

            <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
                {/* --- NAVBAR --- */}
                <nav className="bg-white shadow-sm sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-20 items-center">
                            <div className="flex items-center gap-3">
                                <ApplicationLogo className="w-10 h-10 text-blue-600 fill-current" />
                                <span className="text-2xl font-bold text-gray-900 tracking-tight">
                                    Génesis Hospital
                                </span>
                            </div>

                            <div className="flex gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route("dashboard")}
                                        className="font-semibold text-white bg-blue-600 hover:bg-blue-700 py-2 px-6 rounded-full transition shadow-md"
                                    >
                                        Ir a mi Panel
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route("login")}
                                            className="font-semibold text-gray-600 hover:text-blue-600 transition py-2 px-4"
                                        >
                                            Iniciar Sesión
                                        </Link>

                                        <Link
                                            href={route("register")}
                                            className="font-semibold text-white bg-blue-600 hover:bg-blue-700 py-2 px-6 rounded-full transition shadow-md"
                                        >
                                            Registrarse
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* --- HERO SECTION --- */}
                <header className="relative bg-white overflow-hidden">
                    <div className="max-w-7xl mx-auto">
                        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                            <svg
                                className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
                                fill="currentColor"
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                                aria-hidden="true"
                            >
                                <polygon points="50,0 100,0 50,100 0,100" />
                            </svg>

                            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                                <div className="sm:text-center lg:text-left">
                                    <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                        <span className="block xl:inline">
                                            Tu salud merece la
                                        </span>{" "}
                                        <span className="block text-blue-600 xl:inline">
                                            mejor tecnología
                                        </span>
                                    </h1>
                                    <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                        Gestionamos tu bienestar con un sistema
                                        integral de citas, historial clínico
                                        digital y atención personalizada.
                                        Conecta con los mejores especialistas de
                                        la región.
                                    </p>
                                    <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                        <div className="rounded-md shadow">
                                            {auth.user ? (
                                                <Link
                                                    href={route("dashboard")}
                                                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                                                >
                                                    Entrar al Sistema
                                                </Link>
                                            ) : (
                                                <Link
                                                    href={route("register")}
                                                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                                                >
                                                    Soy Paciente Nuevo
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </main>
                        </div>
                    </div>
                    <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                        <img
                            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
                            src="https://images.unsplash.com/photo-1538108149393-fbbd81897560?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                            alt="Hospital team"
                        />
                    </div>
                </header>

                {/* --- FEATURES SECTION --- */}
                <div className="py-12 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:text-center">
                            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
                                Servicios
                            </h2>
                            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                Todo lo que necesitas en un solo lugar
                            </p>
                        </div>

                        <div className="mt-10">
                            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                                {/* Feature 1 */}
                                <div className="relative">
                                    <dt>
                                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                                            <svg
                                                className="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                        <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                                            Citas en Línea
                                        </p>
                                    </dt>
                                    <dd className="mt-2 ml-16 text-base text-gray-500">
                                        Agenda tu consulta con el especialista
                                        que necesitas sin llamadas ni esperas.
                                        24/7 disponible.
                                    </dd>
                                </div>

                                {/* Feature 2 */}
                                <div className="relative">
                                    <dt>
                                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                                            <svg
                                                className="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                />
                                            </svg>
                                        </div>
                                        <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                                            Historial Digital
                                        </p>
                                    </dt>
                                    <dd className="mt-2 ml-16 text-base text-gray-500">
                                        Tus diagnósticos, recetas y estudios
                                        siempre a la mano. Descarga tus recetas
                                        en PDF al instante.
                                    </dd>
                                </div>

                                {/* Feature 3 */}
                                <div className="relative">
                                    <dt>
                                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                                            <svg
                                                className="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                                            Atención Certificada
                                        </p>
                                    </dt>
                                    <dd className="mt-2 ml-16 text-base text-gray-500">
                                        Contamos con el mejor equipo de médicos
                                        especialistas certificados y tecnología
                                        de punta.
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>

                {/* --- FOOTER --- */}
                <footer className="bg-gray-800 text-white py-8">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <p>
                            &copy; {new Date().getFullYear()} Génesis Hospital.
                            Todos los derechos reservados.
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                            Desarrollado con Laravel 11, React & Inertia.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
