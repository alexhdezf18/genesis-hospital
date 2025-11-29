import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
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
                                            {cita.fecha_cita}{" "}
                                            <span className="text-gray-500 text-sm ml-1">
                                                {cita.hora_cita}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {cita.paciente.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            Dr. {cita.medico.user.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${
                                                    cita.estado === "pendiente"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : cita.estado ===
                                                          "completada"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-gray-100"
                                                }`}
                                            >
                                                {cita.estado.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
