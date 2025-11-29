import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import Modal from "@/Components/Modal"; // Componente de Modal que trae Breeze
import InputError from "@/Components/InputError"; // Componentes pre-hechos de Breeze
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";

export default function Users({ auth, users }) {
    const [showModal, setShowModal] = useState(false);

    // useForm maneja los datos, el envío y los errores automáticamente
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        role: "paciente",
        phone: "",
        specialty: "", // Solo para médicos
        license_number: "", // Solo para médicos
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("users.store"), {
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
                    Gestión de Usuarios
                </h2>
            }
        >
            <Head title="Usuarios" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Botón Crear */}
                    <div className="flex justify-end mb-4">
                        <PrimaryButton onClick={() => setShowModal(true)}>
                            + Nuevo Usuario
                        </PrimaryButton>
                    </div>

                    {/* Tabla de Usuarios */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nombre
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rol
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Detalles
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.data.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${
                                                    user.role === "admin"
                                                        ? "bg-red-100 text-red-800"
                                                        : user.role === "medico"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-blue-100 text-blue-800"
                                                }`}
                                            >
                                                {user.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.medico
                                                ? `Espec: ${user.medico.specialty}`
                                                : "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Paginación simple */}
                        <div className="p-4">
                            {users.links &&
                                users.links.map((link, key) =>
                                    link.url ? (
                                        <a
                                            key={key}
                                            href={link.url}
                                            className={`px-3 py-1 border rounded mr-1 ${
                                                link.active
                                                    ? "bg-blue-500 text-white"
                                                    : ""
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ) : (
                                        <span
                                            key={key}
                                            className="px-3 py-1 border rounded mr-1 text-gray-400"
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    )
                                )}
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL DE CREACIÓN */}
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Registrar Nuevo Usuario
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Nombre */}
                            <div className="col-span-1">
                                <InputLabel value="Nombre" />
                                <TextInput
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            {/* Email */}
                            <div className="col-span-1">
                                <InputLabel value="Email" />
                                <TextInput
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            {/* Password */}
                            <div className="col-span-1">
                                <InputLabel value="Contraseña" />
                                <TextInput
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError
                                    message={errors.password}
                                    className="mt-2"
                                />
                            </div>

                            {/* Rol (Select Nativo con estilos Tailwind) */}
                            <div className="col-span-1">
                                <InputLabel value="Rol" />
                                <select
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    value={data.role}
                                    onChange={(e) =>
                                        setData("role", e.target.value)
                                    }
                                >
                                    <option value="paciente">Paciente</option>
                                    <option value="medico">Médico</option>
                                    <option value="recepcionista">
                                        Recepcionista
                                    </option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>
                        </div>

                        {/* CAMPOS DINÁMICOS DE MÉDICO */}
                        {data.role === "medico" && (
                            <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
                                <h3 className="text-md font-bold text-gray-700 mb-2">
                                    Datos Profesionales
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel value="Especialidad" />
                                        <TextInput
                                            value={data.specialty}
                                            onChange={(e) =>
                                                setData(
                                                    "specialty",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full"
                                        />
                                        <InputError
                                            message={errors.specialty}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel value="Cédula Profesional" />
                                        <TextInput
                                            value={data.license_number}
                                            onChange={(e) =>
                                                setData(
                                                    "license_number",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full"
                                        />
                                        <InputError
                                            message={errors.license_number}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

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
