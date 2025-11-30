import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Agendar({ auth, medicos }) {
    const { data, setData, post, processing, errors } = useForm({
        medico_id: "",
        fecha_cita: "",
        hora_cita: "",
        observaciones: "",
    });

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
                <div className="max-w-xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-6">
                            Completa los detalles de tu visita
                        </h3>

                        <form onSubmit={handleSubmit}>
                            {/* Selección de Médico */}
                            <div className="mb-4">
                                <InputLabel value="Selecciona un Médico" />
                                <select
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    value={data.medico_id}
                                    onChange={(e) =>
                                        setData("medico_id", e.target.value)
                                    }
                                    required
                                >
                                    <option value="">
                                        -- Elige un especialista --
                                    </option>
                                    {medicos.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            Dr. {m.user.name} ({m.specialty})
                                        </option>
                                    ))}
                                </select>
                                <InputError
                                    message={errors.medico_id}
                                    className="mt-2"
                                />
                            </div>

                            {/* Fecha y Hora */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <InputLabel value="Fecha deseada" />
                                    <TextInput
                                        type="date"
                                        className="w-full mt-1"
                                        value={data.fecha_cita}
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        } // No permitir fechas pasadas
                                        onChange={(e) =>
                                            setData(
                                                "fecha_cita",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.fecha_cita}
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <InputLabel value="Hora preferida" />
                                    <TextInput
                                        type="time"
                                        className="w-full mt-1"
                                        value={data.hora_cita}
                                        onChange={(e) =>
                                            setData("hora_cita", e.target.value)
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.hora_cita}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <InputLabel value="Motivo de la consulta (Opcional)" />
                                <textarea
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    rows="3"
                                    placeholder="Ej: Dolor de cabeza frecuente..."
                                    value={data.observaciones}
                                    onChange={(e) =>
                                        setData("observaciones", e.target.value)
                                    }
                                ></textarea>
                            </div>

                            <div className="flex items-center justify-end mt-4">
                                <Link
                                    href={route("dashboard")}
                                    className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancelar
                                </Link>

                                <PrimaryButton
                                    className="ml-4 bg-blue-600 hover:bg-blue-700"
                                    disabled={processing}
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
