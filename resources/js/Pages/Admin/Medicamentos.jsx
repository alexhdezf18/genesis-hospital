import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";

export default function Medicamentos({ auth, medicamentos, filters }) {
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: "",
        codigo: "",
        laboratorio: "",
        stock: "",
        precio: "",
        fecha_vencimiento: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("medicamentos.store"), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    const handleSearch = (e) => {
        router.get(
            route("medicamentos.index"),
            { search: e.target.value },
            { preserveState: true, replace: true }
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800">
                    Farmacia e Inventario
                </h2>
            }
        >
            <Head title="Farmacia" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* BARRA DE ACCIONES */}
                    <div className="flex justify-between items-center mb-4">
                        <div className="w-1/3">
                            <TextInput
                                type="text"
                                className="w-full"
                                placeholder="Buscar medicina o código..."
                                defaultValue={filters.search}
                                onChange={handleSearch}
                            />
                        </div>
                        <PrimaryButton onClick={() => setShowModal(true)}>
                            + Nuevo Medicamento
                        </PrimaryButton>
                    </div>

                    {/* TABLA DE INVENTARIO */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-blue-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-800 uppercase">
                                        Código
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-800 uppercase">
                                        Nombre
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-800 uppercase">
                                        Laboratorio
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-800 uppercase">
                                        Stock
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-800 uppercase">
                                        Precio
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {medicamentos.data.map((med) => (
                                    <tr
                                        key={med.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 text-sm font-mono text-gray-500">
                                            {med.codigo}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            {med.nombre}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {med.laboratorio || "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-bold ${
                                                    med.stock < 10
                                                        ? "bg-red-100 text-red-800"
                                                        : "bg-green-100 text-green-800"
                                                }`}
                                            >
                                                {med.stock} unid.
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-700">
                                            ${med.precio}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {medicamentos.data.length === 0 && (
                            <div className="p-6 text-center text-gray-500">
                                No hay medicamentos registrados.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL DE ALTA */}
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Registrar Medicamento
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel value="Nombre del Medicamento" />
                                <TextInput
                                    className="w-full mt-1"
                                    value={data.nombre}
                                    onChange={(e) =>
                                        setData("nombre", e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.nombre} />
                            </div>
                            <div>
                                <InputLabel value="Código / SKU" />
                                <TextInput
                                    className="w-full mt-1"
                                    value={data.codigo}
                                    onChange={(e) =>
                                        setData("codigo", e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.codigo} />
                            </div>
                            <div>
                                <InputLabel value="Stock Inicial" />
                                <TextInput
                                    type="number"
                                    className="w-full mt-1"
                                    value={data.stock}
                                    onChange={(e) =>
                                        setData("stock", e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.stock} />
                            </div>
                            <div>
                                <InputLabel value="Precio ($)" />
                                <TextInput
                                    type="number"
                                    step="0.50"
                                    className="w-full mt-1"
                                    value={data.precio}
                                    onChange={(e) =>
                                        setData("precio", e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.precio} />
                            </div>
                            <div className="col-span-2">
                                <InputLabel value="Laboratorio (Opcional)" />
                                <TextInput
                                    className="w-full mt-1"
                                    value={data.laboratorio}
                                    onChange={(e) =>
                                        setData("laboratorio", e.target.value)
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
                                Guardar
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
