import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router, Link } from "@inertiajs/react";
import { formatDate, formatTime } from "@/Utils/FormatDate";
import Modal from "@/Components/Modal";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";

export default function Citas({ auth, citas, medicos }) {
    const [showModal, setShowModal] = useState(false);

    // Estados para la búsqueda inteligente
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            modo_paciente: "existente", // 'existente' o 'nuevo'
            paciente_id: "",
            // Campos para nuevo paciente
            nuevo_nombre: "",
            nuevo_email: "",
            nuevo_telefono: "",
            // Campos de cita
            medico_id: "",
            fecha_cita: "",
            hora_cita: "",
            observaciones: "",
        });

    // Lógica de Búsqueda en Vivo
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (
                searchTerm.length > 2 &&
                data.modo_paciente === "existente" &&
                !data.paciente_id
            ) {
                setIsSearching(true);
                fetch(route("api.pacientes.search", { q: searchTerm }))
                    .then((res) => res.json())
                    .then((data) => {
                        setSearchResults(data);
                        setIsSearching(false);
                    });
            } else {
                setSearchResults([]);
            }
        }, 300); // Esperar 300ms después de escribir

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, data.modo_paciente, data.paciente_id]);

    const seleccionarPaciente = (paciente) => {
        setData("paciente_id", paciente.id);
        setSearchTerm(`${paciente.name} (${paciente.phone || "Sin cel"})`);
        setSearchResults([]); // Limpiar lista
        clearErrors();
    };

    const cambiarModo = (modo) => {
        setData({
            ...data,
            modo_paciente: modo,
            paciente_id: "",
            nuevo_nombre: modo === "nuevo" ? searchTerm : "", // Si buscó "Juan", lo usamos para crear
        });
        setSearchResults([]);
        if (modo === "existente") setSearchTerm("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("citas.store"), {
            onSuccess: () => {
                setShowModal(false);
                reset();
                setSearchTerm("");
            },
        });
    };

    // ... (La función cambiarEstado sigue igual) ...
    const cambiarEstado = (id, nuevoEstado) => {
        if (
            confirm(
                `¿Estás seguro de cambiar el estado a "${nuevoEstado.toUpperCase()}"?`
            )
        ) {
            router.patch(
                route("citas.updateStatus", id),
                { estado: nuevoEstado },
                { preserveScroll: true }
            );
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800">
                    Gestión de Citas
                </h2>
            }
        >
            <Head title="Citas" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-end mb-4 gap-2">
                        <Link
                            href={route("citas.calendar")}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded shadow transition inline-flex items-center"
                        >
                            <span className="mr-2">📅</span> Ver Calendario
                        </Link>
                        <PrimaryButton onClick={() => setShowModal(true)}>
                            + Agendar Cita
                        </PrimaryButton>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Fecha/Hora
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Paciente
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Médico
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Estado
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {citas.data.map((cita) => (
                                    <tr key={cita.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-bold text-gray-900">
                                                {formatDate(cita.fecha_cita)}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {formatTime(cita.hora_cita)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {cita.paciente.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            Dr. {cita.medico.user.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mb-1
                                                ${
                                                    cita.estado === "pendiente"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : cita.estado ===
                                                          "completada"
                                                        ? "bg-green-100 text-green-800"
                                                        : cita.estado ===
                                                          "confirmada"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {cita.estado.toUpperCase()}
                                            </span>
                                            {[
                                                "pendiente",
                                                "confirmada",
                                            ].includes(cita.estado) && (
                                                <div className="flex space-x-2 mt-1">
                                                    {cita.estado !==
                                                        "confirmada" && (
                                                        <button
                                                            onClick={() =>
                                                                cambiarEstado(
                                                                    cita.id,
                                                                    "confirmada"
                                                                )
                                                            }
                                                            className="text-xs text-blue-600 font-bold border border-blue-200 px-2 py-1 rounded hover:bg-blue-50"
                                                        >
                                                            ✓ Confirmar
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() =>
                                                            cambiarEstado(
                                                                cita.id,
                                                                "cancelada"
                                                            )
                                                        }
                                                        className="text-xs text-red-600 font-bold border border-red-200 px-2 py-1 rounded hover:bg-red-50"
                                                    >
                                                        ✕ Cancelar
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {citas.data.length === 0 && (
                            <div className="p-6 text-center text-gray-500">
                                No hay citas registradas.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL INTELIGENTE */}
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">
                        {data.modo_paciente === "existente"
                            ? "Buscar Paciente"
                            : "Registrar Nuevo Paciente"}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        {/* SWITCHER DE MODO */}
                        <div className="flex mb-4 bg-gray-100 p-1 rounded-lg">
                            <button
                                type="button"
                                onClick={() => cambiarModo("existente")}
                                className={`flex-1 py-1 text-sm rounded-md transition ${
                                    data.modo_paciente === "existente"
                                        ? "bg-white shadow text-blue-600 font-bold"
                                        : "text-gray-500"
                                }`}
                            >
                                🔍 Buscar Existente
                            </button>
                            <button
                                type="button"
                                onClick={() => cambiarModo("nuevo")}
                                className={`flex-1 py-1 text-sm rounded-md transition ${
                                    data.modo_paciente === "nuevo"
                                        ? "bg-white shadow text-green-600 font-bold"
                                        : "text-gray-500"
                                }`}
                            >
                                ✨ Nuevo Paciente
                            </button>
                        </div>

                        {/* MODO: BUSCAR EXISTENTE */}
                        {data.modo_paciente === "existente" && (
                            <div className="mb-4 relative">
                                <InputLabel value="Buscar por Nombre o Teléfono" />
                                <div className="relative">
                                    <TextInput
                                        className={`w-full ${
                                            data.paciente_id
                                                ? "bg-green-50 border-green-500"
                                                : ""
                                        }`}
                                        placeholder="Escribe para buscar..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setData("paciente_id", ""); // Reset ID si edita
                                        }}
                                        disabled={!!data.paciente_id} // Bloquear si ya seleccionó
                                    />
                                    {data.paciente_id && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setData("paciente_id", "");
                                                setSearchTerm("");
                                            }}
                                            className="absolute right-2 top-2 text-gray-400 hover:text-red-500"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>

                                {/* Lista de Resultados Flotante */}
                                {searchResults.length > 0 &&
                                    !data.paciente_id && (
                                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-40 overflow-y-auto">
                                            {searchResults.map((p) => (
                                                <li
                                                    key={p.id}
                                                    onClick={() =>
                                                        seleccionarPaciente(p)
                                                    }
                                                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b last:border-b-0"
                                                >
                                                    <span className="font-bold">
                                                        {p.name}
                                                    </span>
                                                    <span className="text-gray-500 text-xs ml-2">
                                                        ({p.phone || "Sin tel"}{" "}
                                                        - {p.email})
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                {isSearching && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        Buscando...
                                    </p>
                                )}
                                <InputError
                                    message={errors.paciente_id}
                                    className="mt-2"
                                />
                            </div>
                        )}

                        {/* MODO: NUEVO PACIENTE */}
                        {data.modo_paciente === "nuevo" && (
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4 animate-fade-in-down">
                                <div className="grid grid-cols-1 gap-3">
                                    <div>
                                        <InputLabel value="Nombre Completo" />
                                        <TextInput
                                            className="w-full"
                                            value={data.nuevo_nombre}
                                            onChange={(e) =>
                                                setData(
                                                    "nuevo_nombre",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.nuevo_nombre}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <InputLabel value="Teléfono" />
                                            <TextInput
                                                className="w-full"
                                                value={data.nuevo_telefono}
                                                onChange={(e) =>
                                                    setData(
                                                        "nuevo_telefono",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.nuevo_telefono}
                                            />
                                        </div>
                                        <div>
                                            <InputLabel value="Email" />
                                            <TextInput
                                                type="email"
                                                className="w-full"
                                                value={data.nuevo_email}
                                                onChange={(e) =>
                                                    setData(
                                                        "nuevo_email",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.nuevo_email}
                                            />
                                        </div>
                                    </div>
                                    <p className="text-xs text-green-700 mt-1">
                                        ℹ️ Se creará una cuenta automáticamente
                                        para este paciente.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* CAMPOS DE CITA (COMUNES) */}
                        <div className="border-t pt-4 mt-4">
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                                Detalles de la Cita
                            </h4>
                            <div className="mt-4">
                                <InputLabel value="Médico" />
                                <select
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.medico_id}
                                    onChange={(e) =>
                                        setData("medico_id", e.target.value)
                                    }
                                >
                                    <option value="">
                                        -- Seleccione... --
                                    </option>
                                    {medicos.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            Dr. {m.user.name} - {m.specialty}
                                        </option>
                                    ))}
                                </select>
                                <InputError
                                    message={errors.medico_id}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                    <InputLabel value="Fecha" />
                                    <TextInput
                                        type="date"
                                        className="w-full"
                                        value={data.fecha_cita}
                                        onChange={(e) =>
                                            setData(
                                                "fecha_cita",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.fecha_cita}
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <InputLabel value="Hora" />
                                    <TextInput
                                        type="time"
                                        className="w-full"
                                        value={data.hora_cita}
                                        onChange={(e) =>
                                            setData("hora_cita", e.target.value)
                                        }
                                    />
                                    <InputError
                                        message={errors.hora_cita}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <InputLabel value="Observaciones" />
                                <TextInput
                                    className="w-full"
                                    value={data.observaciones}
                                    onChange={(e) =>
                                        setData("observaciones", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <SecondaryButton
                                onClick={() => setShowModal(false)}
                            >
                                Cancelar
                            </SecondaryButton>
                            <PrimaryButton
                                className="ml-3"
                                disabled={processing}
                            >
                                {data.modo_paciente === "nuevo"
                                    ? "Registrar y Agendar"
                                    : "Agendar Cita"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
