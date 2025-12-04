import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router, Link } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";

export default function Users({ auth, users, filters }) {
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Estado para saber si editamos
    const [editUserId, setEditUserId] = useState(null); // ID del usuario a editar

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: "",
            email: "",
            password: "",
            role: "paciente",
            phone: "",
            specialty: "",
            license_number: "",
        });

    // Abrir modal para CREAR
    const openCreateModal = () => {
        setIsEditing(false);
        setEditUserId(null);
        reset();
        clearErrors();
        setShowModal(true);
    };

    // Abrir modal para EDITAR
    const openEditModal = (user) => {
        setIsEditing(true);
        setEditUserId(user.id);

        setData({
            name: user.name,
            email: user.email,
            password: "", // Password vacío por seguridad
            role: user.role,
            phone: user.phone || "",
            specialty: user.medico?.specialty || "",
            license_number: user.medico?.license_number || "",
        });

        clearErrors();
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing) {
            // Lógica de ACTUALIZAR (PUT)
            put(route("users.update", editUserId), {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        } else {
            // Lógica de CREAR (POST)
            post(route("users.store"), {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    // Función para BORRAR
    const deleteUser = (user) => {
        if (
            confirm(
                `¿Estás seguro de eliminar a ${user.name}? Esta acción no se puede deshacer.`
            )
        ) {
            router.delete(route("users.destroy", user.id));
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        router.get(
            route("users.index"),
            { search: value },
            {
                preserveState: true,
                replace: true,
            }
        );
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
                    <div className="flex justify-between items-center mb-4">
                        <div className="w-1/3">
                            <TextInput
                                type="text"
                                className="w-full"
                                placeholder="Buscar por nombre o email..."
                                defaultValue={filters.search}
                                onChange={handleSearch}
                            />
                        </div>
                        <PrimaryButton onClick={openCreateModal}>
                            + Nuevo Usuario
                        </PrimaryButton>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Nombre
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Rol
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.data.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-bold">
                                                {user.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {user.phone}
                                            </div>
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
                                                        : user.role ===
                                                          "recepcionista"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-blue-100 text-blue-800"
                                                }`}
                                            >
                                                {user.role.toUpperCase()}
                                            </span>
                                            {user.medico && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {user.medico.specialty}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() =>
                                                    openEditModal(user)
                                                }
                                                className="text-indigo-600 hover:text-indigo-900 mr-4 font-bold"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => deleteUser(user)}
                                                className="text-red-600 hover:text-red-900 font-bold"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Paginación */}
                        <div className="p-4 bg-white border-t border-gray-200 flex justify-center">
                            {users.links.map((link, key) =>
                                link.url ? (
                                    <Link
                                        key={key}
                                        href={link.url}
                                        className={`px-3 py-1 border mx-1 rounded text-sm ${
                                            link.active
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ) : (
                                    <span
                                        key={key}
                                        className="px-3 py-1 border mx-1 rounded text-sm text-gray-400"
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

            {/* MODAL (Reutilizado para Crear y Editar) */}
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        {isEditing
                            ? "Editar Usuario"
                            : "Registrar Nuevo Usuario"}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
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

                            <div className="col-span-1">
                                <InputLabel
                                    value={
                                        isEditing
                                            ? "Contraseña (Opcional)"
                                            : "Contraseña"
                                    }
                                />
                                <TextInput
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    required={!isEditing} // Solo obligatoria al crear
                                    placeholder={
                                        isEditing
                                            ? "Dejar vacío para no cambiar"
                                            : ""
                                    }
                                />
                                <InputError
                                    message={errors.password}
                                    className="mt-2"
                                />
                            </div>

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

                            <div className="col-span-2">
                                <InputLabel value="Teléfono" />
                                <TextInput
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData("phone", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                />
                            </div>
                        </div>

                        {data.role === "medico" && (
                            <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200 animate-fade-in">
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
                                {isEditing ? "Actualizar" : "Guardar"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
