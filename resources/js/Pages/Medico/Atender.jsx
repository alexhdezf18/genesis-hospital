import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";

export default function Atender({ auth, cita }) {
    const { data, setData, post, processing, errors } = useForm({
        cita_id: cita.id,
        sintomas: "",
        diagnostico: "",
        tratamiento: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("consulta.store"));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800">
                    Consulta Médica en Curso
                </h2>
            }
        >
            <Head title="Atender Paciente" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Tarjeta de Información del Paciente */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-blue-900">
                                    Paciente: {cita.paciente.name}
                                </h3>
                                <p className="text-sm text-blue-700">
                                    Email: {cita.paciente.email}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                                    Fecha Cita
                                </span>
                                <p className="font-bold text-gray-700">
                                    {cita.fecha_cita} - {cita.hora_cita}
                                </p>
                            </div>
                        </div>
                        {cita.observaciones && (
                            <div className="mt-3 text-sm bg-white p-2 rounded border border-blue-100">
                                <strong>Motivo inicial:</strong>{" "}
                                {cita.observaciones}
                            </div>
                        )}
                    </div>

                    {/* Formulario Médico */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={handleSubmit}>
                            {/* Campo 1: Síntomas */}
                            <div className="mb-6">
                                <InputLabel
                                    value="1. Síntomas y Signos (Anamnesis)"
                                    className="text-lg text-indigo-700 font-bold mb-2"
                                />
                                <textarea
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-32"
                                    placeholder="Describa qué siente el paciente..."
                                    value={data.sintomas}
                                    onChange={(e) =>
                                        setData("sintomas", e.target.value)
                                    }
                                ></textarea>
                                <InputError
                                    message={errors.sintomas}
                                    className="mt-2"
                                />
                            </div>

                            {/* Campo 2: Diagnóstico */}
                            <div className="mb-6">
                                <InputLabel
                                    value="2. Diagnóstico Médico"
                                    className="text-lg text-indigo-700 font-bold mb-2"
                                />
                                <textarea
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-24"
                                    placeholder="Conclusión médica..."
                                    value={data.diagnostico}
                                    onChange={(e) =>
                                        setData("diagnostico", e.target.value)
                                    }
                                ></textarea>
                                <InputError
                                    message={errors.diagnostico}
                                    className="mt-2"
                                />
                            </div>

                            {/* Campo 3: Tratamiento */}
                            <div className="mb-6">
                                <InputLabel
                                    value="3. Tratamiento y Receta"
                                    className="text-lg text-indigo-700 font-bold mb-2"
                                />
                                <textarea
                                    className="w-full bg-gray-50 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-40 font-mono"
                                    placeholder="Medicamentos, dosis y recomendaciones..."
                                    value={data.tratamiento}
                                    onChange={(e) =>
                                        setData("tratamiento", e.target.value)
                                    }
                                ></textarea>
                                <InputError
                                    message={errors.tratamiento}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex justify-end pt-4 border-t border-gray-100">
                                <PrimaryButton
                                    className="bg-green-600 hover:bg-green-700 text-lg px-6 py-3"
                                    disabled={processing}
                                >
                                    Finalizar Consulta
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
