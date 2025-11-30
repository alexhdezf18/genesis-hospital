import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import { formatDate } from "@/Utils/FormatDate";

export default function Atender({ auth, cita, historialPrevio }) {
    const { data, setData, post, processing, errors } = useForm({
        cita_id: cita.id,
        sintomas: "",
        diagnostico: "",
        tratamiento: "",
        archivo: null,
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
                    Atención Médica
                </h2>
            }
        >
            <Head title="Consulta" />

            <div className="py-6 max-w-7xl mx-auto sm:px-6 lg:px-8">
                {/* ENCABEZADO DEL PACIENTE */}
                <div className="bg-white border-l-8 border-blue-600 p-6 mb-6 shadow rounded-r-lg flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                            {cita.paciente.name}
                        </h3>
                        <p className="text-gray-500">
                            Motivo de hoy:{" "}
                            {cita.observaciones || "Consulta General"}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-400 uppercase tracking-wider">
                            Folio Cita
                        </div>
                        <div className="text-xl font-mono font-bold">
                            #{cita.id}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* COLUMNA IZQUIERDA: FORMULARIO ACTUAL */}
                    <div className="lg:col-span-2">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border border-gray-100">
                            <h4 className="text-lg font-semibold text-blue-800 mb-6 border-b pb-2">
                                Nueva Nota Médica
                            </h4>

                            <form onSubmit={handleSubmit}>
                                {/* 1. Síntomas */}
                                <div className="mb-6">
                                    <InputLabel
                                        value="1. Anamnesis (Síntomas Subjetivos)"
                                        className="font-bold text-gray-700"
                                    />
                                    <textarea
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 h-24 mt-1"
                                        placeholder="¿Qué dolor presenta? ¿Desde cuándo?"
                                        value={data.sintomas}
                                        onChange={(e) =>
                                            setData("sintomas", e.target.value)
                                        }
                                    ></textarea>
                                    <InputError message={errors.sintomas} />
                                </div>

                                {/* 2. Diagnóstico */}
                                <div className="mb-6">
                                    <InputLabel
                                        value="2. Diagnóstico (CIE-10)"
                                        className="font-bold text-gray-700"
                                    />
                                    <textarea
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 h-20 mt-1"
                                        placeholder="Conclusión diagnóstica..."
                                        value={data.diagnostico}
                                        onChange={(e) =>
                                            setData(
                                                "diagnostico",
                                                e.target.value
                                            )
                                        }
                                    ></textarea>
                                    <InputError message={errors.diagnostico} />
                                </div>

                                {/* 3. Tratamiento (ESTE ES EL QUE FALTABA) */}
                                <div className="mb-6">
                                    <InputLabel
                                        value="3. Plan de Tratamiento"
                                        className="font-bold text-gray-700"
                                    />
                                    <textarea
                                        className="w-full bg-blue-50 border-blue-200 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 h-32 mt-1 font-mono text-sm"
                                        placeholder="Medicamentos, dosis e indicaciones..."
                                        value={data.tratamiento}
                                        onChange={(e) =>
                                            setData(
                                                "tratamiento",
                                                e.target.value
                                            )
                                        }
                                    ></textarea>
                                    <InputError message={errors.tratamiento} />
                                </div>

                                {/* 4. Archivo Adjunto */}
                                <div className="mb-6">
                                    <InputLabel
                                        value="4. Adjuntar Estudios (PDF/Imagen)"
                                        className="text-lg text-indigo-700 font-bold mb-2"
                                    />
                                    <div className="mt-1 flex items-center">
                                        <input
                                            type="file"
                                            className="block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-blue-50 file:text-blue-700
                                            hover:file:bg-blue-100"
                                            onChange={(e) =>
                                                setData(
                                                    "archivo",
                                                    e.target.files[0]
                                                )
                                            }
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Formatos: PDF, JPG, PNG. Máx 2MB.
                                    </p>
                                    <InputError
                                        message={errors.archivo}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="flex justify-end pt-4">
                                    <PrimaryButton
                                        className="bg-blue-600 hover:bg-blue-700 w-full justify-center py-3 text-lg"
                                        disabled={processing}
                                    >
                                        <i className="fas fa-save mr-2"></i>{" "}
                                        Guardar y Finalizar
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: HISTORIAL */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 p-4 rounded-lg shadow-inner max-h-screen overflow-y-auto">
                            <h4 className="text-gray-500 uppercase tracking-widest text-xs font-bold mb-4">
                                Expediente Histórico
                            </h4>

                            {historialPrevio.length > 0 ? (
                                <div className="space-y-4">
                                    {historialPrevio.map((hist) => (
                                        <div
                                            key={hist.id}
                                            className="bg-white p-4 rounded border border-gray-200 shadow-sm text-sm hover:border-blue-300 transition"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-bold text-gray-700">
                                                    {new Date(
                                                        hist.created_at
                                                    ).toLocaleDateString()}
                                                </span>
                                                <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">
                                                    Dr. {hist.medico.user.name}
                                                </span>
                                            </div>
                                            <div className="mb-2">
                                                <strong className="text-blue-600 text-xs uppercase">
                                                    Diagnóstico:
                                                </strong>
                                                <p className="text-gray-800 line-clamp-2">
                                                    {hist.diagnostico}
                                                </p>
                                            </div>
                                            <div>
                                                <strong className="text-green-600 text-xs uppercase">
                                                    Tratamiento:
                                                </strong>
                                                <p className="text-gray-500 truncate">
                                                    {hist.tratamiento}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded">
                                    <p>Primer consulta del paciente.</p>
                                    <p className="text-xs">
                                        No hay registros previos.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
