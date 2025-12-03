import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const { flash = {} } = usePage().props;
    const unreadCount = usePage().props.auth.notificationsCount;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    // ESCUCHAMOS MENSAJES DE LARAVEL
    useEffect(() => {
        // El signo de interrogación ?. evita el error si flash es null
        if (flash?.success) {
            toast.success(flash.success, {
                duration: 4000,
                position: "bottom-center",
                style: {
                    background: "#10B981", // Verde esmeralda
                    color: "#fff",
                    fontWeight: "bold",
                    borderRadius: "50px", // Bordes más redondos (estilo píldora)
                    padding: "16px 24px", // Un poco más grande
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)", // Sombra elegante
                },
                iconTheme: {
                    primary: "#fff",
                    secondary: "#10B981",
                },
            });
        }
        if (flash?.error) {
            toast.error(flash.error, {
                duration: 5000,
                position: "bottom-center",
                style: {
                    background: "#EF4444", // Rojo
                    color: "#fff",
                    fontWeight: "bold",
                    borderRadius: "50px",
                    padding: "16px 24px",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                },
                iconTheme: {
                    primary: "#fff",
                    secondary: "#EF4444",
                },
            });
        }
    }, [flash]);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Componente que muestra las alertas */}
            <Toaster />

            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            {/* --- MENÚ DE ESCRITORIO --- */}
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route("dashboard")}
                                    active={route().current("dashboard")}
                                >
                                    Inicio
                                </NavLink>

                                {user.role === "admin" && (
                                    <>
                                        <NavLink
                                            href={route("users.index")}
                                            active={route().current("users.*")}
                                        >
                                            Usuarios
                                        </NavLink>
                                        <NavLink
                                            href={route("citas.index")}
                                            active={route().current("citas.*")}
                                        >
                                            Gestión Citas
                                        </NavLink>
                                        <NavLink
                                            href={route("medicamentos.index")}
                                            active={route().current(
                                                "medicamentos.*"
                                            )}
                                        >
                                            Farmacia
                                        </NavLink>
                                    </>
                                )}

                                {user.role === "recepcionista" && (
                                    <NavLink
                                        href={route("citas.index")}
                                        active={route().current("citas.*")}
                                    >
                                        Agenda y Citas
                                    </NavLink>
                                )}

                                {user.role === "paciente" && (
                                    <NavLink
                                        href={route("paciente.agendar")}
                                        active={route().current(
                                            "paciente.agendar"
                                        )}
                                    >
                                        Nueva Cita
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        {/* --- CAMPANA DE NOTIFICACIONES --- */}
                        <div className="flex items-center mr-4">
                            <Link
                                href={route("notifications.index")}
                                className="relative text-gray-500 hover:text-gray-700 transition"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                    />
                                </svg>

                                {/* Puntito rojo si hay notificaciones */}
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-red-500 transform translate-x-1/2 -translate-y-1/2"></span>
                                )}
                            </Link>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none">
                                                {user.name}
                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route("dashboard")}
                            active={route().current("dashboard")}
                        >
                            Inicio
                        </ResponsiveNavLink>
                        {user.role === "admin" && (
                            <>
                                <ResponsiveNavLink
                                    href={route("users.index")}
                                    active={route().current("users.*")}
                                >
                                    Usuarios
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route("citas.index")}
                                    active={route().current("citas.*")}
                                >
                                    Gestión Citas
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route("medicamentos.index")}
                                    active={route().current("medicamentos.*")}
                                >
                                    Farmacia
                                </ResponsiveNavLink>
                            </>
                        )}
                        {user.role === "recepcionista" && (
                            <ResponsiveNavLink
                                href={route("citas.index")}
                                active={route().current("citas.*")}
                            >
                                Agenda y Citas
                            </ResponsiveNavLink>
                        )}
                        {user.role === "paciente" && (
                            <ResponsiveNavLink
                                href={route("paciente.agendar")}
                                active={route().current("paciente.agendar")}
                            >
                                Nueva Cita
                            </ResponsiveNavLink>
                        )}
                    </div>
                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>
                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route("profile.edit")}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
