import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";

export default function RecepcionistaDashboard({ auth, pendientes }) {
    const [citaSeleccionada, setCitaSeleccionada] = useState(null);

    // Formulario de pago
    const { data, setData, post, processing, errors, reset } = useForm({
        cita_id: "",
        monto: "",
        metodo_pago: "efectivo",
    });

    const abrirCobro = (cita) => {
        setCitaSeleccionada(cita);
        setData("cita_id", cita.id);
    };

    const cerrarModal = () => {
        setCitaSeleccionada(null);
        reset();
    };

    const submitPago = (e) => {
        e.preventDefault();
        post(route("pagos.store"), {
            onSuccess: () => cerrarModal(),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800">
                    Caja y Facturación
                </h2>
            }
        >
            <Head title="Recepción" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Citas Pendientes de Cobro
                            </h3>

                            {pendientes.length > 0 ? (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Folio
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Paciente
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Médico
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Acción
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {pendientes.map((cita) => (
                                            <tr key={cita.id}>
                                                <td className="px-6 py-4">
                                                    #{cita.id}
                                                </td>
                                                <td className="px-6 py-4 font-bold">
                                                    {cita.paciente.name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    Dr. {cita.medico.user.name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() =>
                                                            abrirCobro(cita)
                                                        }
                                                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-xs"
                                                    >
                                                        COBRAR
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-10 text-gray-500">
                                    <p>
                                        🎉 No hay cobros pendientes. Todo está
                                        al día.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL DE COBRO */}
            <Modal show={citaSeleccionada !== null} onClose={cerrarModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Registrar Pago - Cita #{citaSeleccionada?.id}
                    </h2>
                    <p className="mb-4 text-sm text-gray-600">
                        Paciente:{" "}
                        <strong>{citaSeleccionada?.paciente.name}</strong>
                    </p>

                    <form onSubmit={submitPago}>
                        <div className="mt-4">
                            <InputLabel value="Monto a Cobrar ($)" />
                            <TextInput
                                type="number"
                                className="mt-1 block w-full text-lg font-bold"
                                value={data.monto}
                                onChange={(e) =>
                                    setData("monto", e.target.value)
                                }
                                placeholder="0.00"
                                required
                            />
                            <InputError
                                message={errors.monto}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4">
                            <InputLabel value="Método de Pago" />
                            <select
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                value={data.metodo_pago}
                                onChange={(e) =>
                                    setData("metodo_pago", e.target.value)
                                }
                            >
                                <option value="efectivo">Efectivo 💵</option>
                                <option value="tarjeta">Tarjeta 💳</option>
                                <option value="transferencia">
                                    Transferencia 🏦
                                </option>
                            </select>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <SecondaryButton onClick={cerrarModal}>
                                Cancelar
                            </SecondaryButton>
                            <PrimaryButton
                                className="ml-3 bg-green-600"
                                disabled={processing}
                            >
                                Confirmar Pago
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
