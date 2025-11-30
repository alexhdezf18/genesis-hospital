import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import { useState } from "react";

export default function Atender({ auth, cita, historialPrevio, inventario }) {
    // Estado local para manejar la medicina que se está agregando actualmente
    const [medicinaTemp, setMedicinaTemp] = useState({
        id: "",
        cantidad: 1,
        dosis: "",
    });

    const { data, setData, post, processing, errors } = useForm({
        cita_id: cita.id,
        sintomas: "",
        diagnostico: "",
        tratamiento: "", // Texto general
        receta: [], // Array de objetos {id, cantidad, dosis}
        archivo: null,
    });

    // Función para agregar medicina a la lista visual
    const agregarMedicina = () => {
        if (!medicinaTemp.id) return;

        const medicinaReal = inventario.find((m) => m.id == medicinaTemp.id);

        // Agregamos al array de "receta"
        setData("receta", [
            ...data.receta,
            {
                ...medicinaTemp,
                nombre: medicinaReal.nombre,
                codigo: medicinaReal.codigo,
            },
        ]);

        // Limpiamos el input temporal
        setMedicinaTemp({ id: "", cantidad: 1, dosis: "" });
    };

    // Función para quitar de la lista
    const quitarMedicina = (index) => {
        const nuevaReceta = [...data.receta];
        nuevaReceta.splice(index, 1);
        setData("receta", nuevaReceta);
    };

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
                {/* ENCABEZADO (Igual que antes) */}
                <div className="bg-white border-l-8 border-blue-600 p-6 mb-6 shadow rounded-r-lg flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                            {cita.paciente.name}
                        </h3>
                        <p className="text-gray-500">
                            Motivo: {cita.observaciones || "Consulta General"}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-400 uppercase tracking-wider">
                            Folio
                        </div>
                        <div className="text-xl font-mono font-bold">
                            #{cita.id}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* COLUMNA IZQUIERDA: FORMULARIO */}
                    <div className="lg:col-span-2">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border border-gray-100">
                            <h4 className="text-lg font-semibold text-blue-800 mb-6 border-b pb-2">
                                Nueva Nota Médica
                            </h4>

                            <form onSubmit={handleSubmit}>
                                {/* Campos de Texto (Síntomas, Diagnóstico) */}
                                <div className="mb-4">
                                    <InputLabel
                                        value="1. Anamnesis / Síntomas"
                                        className="font-bold text-gray-700"
                                    />
                                    <textarea
                                        className="w-full border-gray-300 rounded-md shadow-sm h-20 mt-1"
                                        value={data.sintomas}
                                        onChange={(e) =>
                                            setData("sintomas", e.target.value)
                                        }
                                    ></textarea>
                                    <InputError message={errors.sintomas} />
                                </div>

                                <div className="mb-4">
                                    <InputLabel
                                        value="2. Diagnóstico"
                                        className="font-bold text-gray-700"
                                    />
                                    <textarea
                                        className="w-full border-gray-300 rounded-md shadow-sm h-16 mt-1"
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

                                {/* --- NUEVO: MÓDULO DE RECETA INTELIGENTE --- */}
                                <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                                    <h5 className="font-bold text-blue-800 mb-3 flex items-center">
                                        <span className="mr-2">💊</span>{" "}
                                        Prescripción de Farmacia
                                    </h5>

                                    {/* Inputs para agregar */}
                                    <div className="flex gap-2 mb-3">
                                        <div className="flex-1">
                                            <select
                                                className="w-full border-gray-300 rounded-md text-sm"
                                                value={medicinaTemp.id}
                                                onChange={(e) =>
                                                    setMedicinaTemp({
                                                        ...medicinaTemp,
                                                        id: e.target.value,
                                                    })
                                                }
                                            >
                                                <option value="">
                                                    -- Seleccionar Medicamento
                                                    --
                                                </option>
                                                {inventario.map((m) => (
                                                    <option
                                                        key={m.id}
                                                        value={m.id}
                                                    >
                                                        {m.nombre} (Stock:{" "}
                                                        {m.stock}) -{" "}
                                                        {m.laboratorio}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="w-20">
                                            <TextInput
                                                type="number"
                                                placeholder="Cant."
                                                className="w-full text-sm"
                                                value={medicinaTemp.cantidad}
                                                onChange={(e) =>
                                                    setMedicinaTemp({
                                                        ...medicinaTemp,
                                                        cantidad:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="w-1/3">
                                            <TextInput
                                                placeholder="Dosis (ej: c/8h)"
                                                className="w-full text-sm"
                                                value={medicinaTemp.dosis}
                                                onChange={(e) =>
                                                    setMedicinaTemp({
                                                        ...medicinaTemp,
                                                        dosis: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={agregarMedicina}
                                            className="bg-blue-600 text-white px-3 rounded hover:bg-blue-700 font-bold"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Lista de agregados */}
                                    {data.receta.length > 0 ? (
                                        <ul className="bg-white rounded border divide-y">
                                            {data.receta.map((item, index) => (
                                                <li
                                                    key={index}
                                                    className="p-2 text-sm flex justify-between items-center"
                                                >
                                                    <span>
                                                        <span className="font-bold">
                                                            {item.cantidad}x
                                                        </span>{" "}
                                                        {item.nombre}
                                                        <span className="text-gray-500 italic ml-2">
                                                            ({item.dosis})
                                                        </span>
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            quitarMedicina(
                                                                index
                                                            )
                                                        }
                                                        className="text-red-500 hover:text-red-700 font-bold"
                                                    >
                                                        ✕
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-xs text-gray-500 italic text-center">
                                            No hay medicamentos agregados.
                                        </p>
                                    )}
                                </div>
                                {/* ------------------------------------------- */}

                                <div className="mb-4">
                                    <InputLabel
                                        value="3. Indicaciones Generales / Tratamiento Adicional"
                                        className="font-bold text-gray-700"
                                    />
                                    <textarea
                                        className="w-full border-gray-300 rounded-md shadow-sm h-24 mt-1"
                                        placeholder="Ej: Reposo, dieta blanda, etc."
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

                                <div className="flex justify-end pt-4">
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

                    {/* COLUMNA DERECHA: HISTORIAL (Igual que antes) */}
                    <div className="lg:col-span-1">
                        {/* ... Aquí puedes dejar el historial previo como estaba ... */}
                        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                            <h4 className="text-gray-500 uppercase font-bold mb-4 text-xs">
                                Expediente
                            </h4>
                            {historialPrevio.length === 0 && (
                                <p className="text-gray-400 text-center text-sm">
                                    Sin historial.
                                </p>
                            )}
                            {historialPrevio.map((h) => (
                                <div
                                    key={h.id}
                                    className="bg-white p-3 mb-3 rounded shadow-sm text-sm border-l-4 border-gray-300"
                                >
                                    <div className="font-bold text-gray-800">
                                        {new Date(
                                            h.created_at
                                        ).toLocaleDateString()}
                                    </div>
                                    <div className="text-gray-600">
                                        {h.diagnostico}
                                    </div>

                                    {/* Mostrar medicinas recetadas antes */}
                                    {h.medicamentos &&
                                        h.medicamentos.length > 0 && (
                                            <div className="mt-2 pt-2 border-t border-dashed">
                                                <p className="text-xs font-bold text-blue-600">
                                                    Rx:
                                                </p>
                                                <ul className="list-disc pl-4 text-xs text-gray-500">
                                                    {h.medicamentos.map((m) => (
                                                        <li key={m.id}>
                                                            {m.nombre} (
                                                            {m.pivot.cantidad})
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
