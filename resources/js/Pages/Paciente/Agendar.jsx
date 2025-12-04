import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { useState, useEffect } from "react";

export default function Agendar({ auth, especialidades }) {
    // Estados locales para la lógica de cascada
    const [medicosFiltrados, setMedicosFiltrados] = useState([]);
    const [horariosDisponibles, setHorariosDisponibles] = useState([]);
    const [loadingHorarios, setLoadingHorarios] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        especialidad: "", // Nuevo campo para filtrar
        medico_id: "",
        fecha_cita: "",
        hora_cita: "",
        observaciones: "",
    });

    // 1. Cuando cambia la ESPECIALIDAD -> Cargar Médicos
    useEffect(() => {
        if (data.especialidad) {
            fetch(
                route("api.medicos.filter", { especialidad: data.especialidad })
            )
                .then((res) => res.json())
                .then((medicos) => {
                    setMedicosFiltrados(medicos);
                    setData("medico_id", ""); // Reset médico
                    setHorariosDisponibles([]); // Reset horarios
                });
        }
    }, [data.especialidad]);

    // 2. Cuando cambia MÉDICO o FECHA -> Cargar Horarios
    useEffect(() => {
        if (data.medico_id && data.fecha_cita) {
            setLoadingHorarios(true);
            fetch(
                route("api.slots", {
                    medico_id: data.medico_id,
                    fecha: data.fecha_cita,
                })
            )
                .then((res) => res.json())
                .then((slots) => {
                    setHorariosDisponibles(slots);
                    setLoadingHorarios(false);
                });
        }
    }, [data.medico_id, data.fecha_cita]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("paciente.store"));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800">
                    Solicitar Cita Médica
                </h2>
            }
        >
            <Head title="Agendar Cita" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">
                            Agenda tu visita en 3 pasos
                        </h3>

                        <form onSubmit={handleSubmit}>
                            {/* PASO 1: ESPECIALIDAD */}
                            <div className="mb-6">
                                <InputLabel
                                    value="1. ¿Qué especialidad buscas?"
                                    className="text-lg text-blue-700"
                                />
                                <select
                                    className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    value={data.especialidad}
                                    onChange={(e) =>
                                        setData("especialidad", e.target.value)
                                    }
                                    required
                                >
                                    <option value="">
                                        -- Seleccionar Especialidad --
                                    </option>
                                    {especialidades.map((esp, index) => (
                                        <option key={index} value={esp}>
                                            {esp}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* PASO 2: MÉDICO (Solo aparece si hay especialidad) */}
                            {data.especialidad && (
                                <div className="mb-6 animate-fade-in">
                                    <InputLabel
                                        value="2. Elige a tu especialista"
                                        className="text-lg text-blue-700"
                                    />
                                    <div className="grid grid-cols-1 gap-3 mt-2">
                                        {medicosFiltrados.map((m) => (
                                            <div
                                                key={m.id}
                                                onClick={() =>
                                                    setData("medico_id", m.id)
                                                }
                                                className={`p-3 border rounded-lg cursor-pointer flex justify-between items-center transition
                                                    ${
                                                        data.medico_id == m.id
                                                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                                                            : "hover:border-gray-400"
                                                    }`}
                                            >
                                                <div>
                                                    <span className="font-bold block">
                                                        Dr. {m.user.name}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        Cédula:{" "}
                                                        {m.license_number}
                                                    </span>
                                                </div>
                                                {data.medico_id == m.id && (
                                                    <span className="text-blue-600 font-bold">
                                                        ✓
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <InputError
                                        message={errors.medico_id}
                                        className="mt-2"
                                    />
                                </div>
                            )}

                            {/* PASO 3: FECHA Y HORA (Solo si hay médico) */}
                            {data.medico_id && (
                                <div className="mb-6 animate-fade-in">
                                    <InputLabel
                                        value="3. Selecciona fecha y hora"
                                        className="text-lg text-blue-700"
                                    />

                                    <input
                                        type="date"
                                        className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        value={data.fecha_cita}
                                        onChange={(e) => {
                                            setData(
                                                "fecha_cita",
                                                e.target.value
                                            );
                                            setData("hora_cita", ""); // Reset hora al cambiar fecha
                                        }}
                                        required
                                    />
                                    <InputError
                                        message={errors.fecha_cita}
                                        className="mt-2"
                                    />

                                    {/* GRID DE HORARIOS */}
                                    {data.fecha_cita && (
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-600 mb-2">
                                                Horarios disponibles para el{" "}
                                                {data.fecha_cita}:
                                            </p>

                                            {loadingHorarios ? (
                                                <p className="text-sm text-gray-400">
                                                    Buscando espacios...
                                                </p>
                                            ) : horariosDisponibles.length >
                                              0 ? (
                                                <div className="grid grid-cols-4 gap-3">
                                                    {horariosDisponibles.map(
                                                        (hora, index) => (
                                                            <button
                                                                key={index}
                                                                type="button"
                                                                onClick={() =>
                                                                    setData(
                                                                        "hora_cita",
                                                                        hora
                                                                    )
                                                                }
                                                                className={`py-2 px-1 text-center rounded text-sm font-bold transition
                                                                ${
                                                                    data.hora_cita ===
                                                                    hora
                                                                        ? "bg-blue-600 text-white shadow-lg transform scale-105"
                                                                        : "bg-green-100 text-green-700 hover:bg-green-200"
                                                                }`}
                                                            >
                                                                {hora}
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-red-500 text-sm bg-red-50 p-2 rounded">
                                                    🚫 No hay horarios
                                                    disponibles este día. Prueba
                                                    otra fecha.
                                                </p>
                                            )}
                                            <InputError
                                                message={errors.hora_cita}
                                                className="mt-2"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* EXTRA: OBSERVACIONES */}
                            {data.hora_cita && (
                                <div className="mb-6 animate-fade-in">
                                    <InputLabel value="Motivo (Opcional)" />
                                    <textarea
                                        className="w-full border-gray-300 rounded-md shadow-sm mt-1"
                                        rows="2"
                                        value={data.observaciones}
                                        onChange={(e) =>
                                            setData(
                                                "observaciones",
                                                e.target.value
                                            )
                                        }
                                    ></textarea>
                                </div>
                            )}

                            <div className="flex items-center justify-end mt-8 border-t pt-4">
                                <Link
                                    href={route("dashboard")}
                                    className="text-gray-600 hover:text-gray-900 mr-4"
                                >
                                    Cancelar
                                </Link>
                                <PrimaryButton
                                    className="bg-blue-600 hover:bg-blue-700 text-lg px-6 py-2"
                                    disabled={!data.hora_cita || processing}
                                >
                                    Confirmar Cita
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
