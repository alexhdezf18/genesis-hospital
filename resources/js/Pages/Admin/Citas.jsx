import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { formatDate, formatTime } from "@/Utils/FormatDate";
import Modal from "@/Components/Modal";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";

export default function Citas({ auth, citas, pacientes, medicos }) {
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        paciente_id: "",
        medico_id: "",
        fecha_cita: "",
        hora_cita: "",
        observaciones: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("citas.store"), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    const cambiarEstado = (id, nuevoEstado) => {
        if (
            confirm(
                `¿Estás seguro de cambiar el estado a "${nuevoEstado.toUpperCase()}"?`
            )
        ) {
            router.patch(
                route("citas.updateStatus", id),
                {
                    estado: nuevoEstado,
                },
                {
                    preserveScroll: true,
                }
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
                    <div className="flex justify-end mb-4">
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
                                            {/* Uso correcto de las funciones importadas */}
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
                                            {/* Badge de Estado Actual */}
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

                                            {/* Botones de Acción (Solo si no está completada/cancelada) */}
                                            {[
                                                "pendiente",
                                                "confirmada",
                                            ].includes(cita.estado) && (
                                                <div className="flex space-x-2 mt-1">
                                                    {/* Botón Confirmar */}
                                                    {cita.estado !==
                                                        "confirmada" && (
                                                        <button
                                                            onClick={() =>
                                                                cambiarEstado(
                                                                    cita.id,
                                                                    "confirmada"
                                                                )
                                                            }
                                                            className="text-xs text-blue-600 hover:text-blue-900 font-bold border border-blue-200 px-2 py-1 rounded hover:bg-blue-50"
                                                            title="Confirmar asistencia"
                                                        >
                                                            ✓ Confirmar
                                                        </button>
                                                    )}

                                                    {/* Botón Cancelar */}
                                                    <button
                                                        onClick={() =>
                                                            cambiarEstado(
                                                                cita.id,
                                                                "cancelada"
                                                            )
                                                        }
                                                        className="text-xs text-red-600 hover:text-red-900 font-bold border border-red-200 px-2 py-1 rounded hover:bg-red-50"
                                                        title="Cancelar cita"
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

                        {/* Mensaje si no hay citas */}
                        {citas.data.length === 0 && (
                            <div className="p-6 text-center text-gray-500">
                                No hay citas registradas.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL DE AGENDAMIENTO */}
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Agendar Nueva Cita
                    </h2>
                    <form onSubmit={handleSubmit}>
                        {/* Selección de Paciente */}
                        <div className="mt-4">
                            <InputLabel value="Paciente" />
                            <select
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.paciente_id}
                                onChange={(e) =>
                                    setData("paciente_id", e.target.value)
                                }
                            >
                                <option value="">Seleccione...</option>
                                {pacientes.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} ({p.email})
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.paciente_id}
                                className="mt-2"
                            />
                        </div>

                        {/* Selección de Médico */}
                        <div className="mt-4">
                            <InputLabel value="Médico" />
                            <select
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.medico_id}
                                onChange={(e) =>
                                    setData("medico_id", e.target.value)
                                }
                            >
                                <option value="">Seleccione...</option>
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

                        {/* Fecha y Hora */}
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <InputLabel value="Fecha" />
                                <TextInput
                                    type="date"
                                    className="w-full"
                                    value={data.fecha_cita}
                                    onChange={(e) =>
                                        setData("fecha_cita", e.target.value)
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
                            <InputLabel value="Observaciones (Opcional)" />
                            <textarea
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                rows="2"
                                value={data.observaciones}
                                onChange={(e) =>
                                    setData("observaciones", e.target.value)
                                }
                            ></textarea>
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
                                Agendar
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
