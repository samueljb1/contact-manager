import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';

export default function Index() {
    const { contacts } = usePage().props;

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Contacts</h2>}>
            <Head title="Contacts" />

            <div className="py-6 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                    {/* Enlace para crear un nuevo contacto */}
                    <Link
                        href={route('contacts.create')}
                        className="bg-green-600 text-white px-4 py-2 rounded mb-4 inline-block"
                    >
                        + New Contact
                    </Link>

                    {/* Tabla de contactos */}
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="text-left">Name</th>
                                <th className="text-left">Province</th>
                                <th className="text-left">City</th>
                                <th className="text-left">Actions</th> {/* Nueva columna para las acciones */}
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.data.map((contact) => (
                                <tr key={contact.id}>
                                    <td className="py-2">{contact.name}</td>
                                    <td className="py-2">{contact.province}</td>
                                    <td className="py-2">{contact.city}</td>
                                    <td className="py-2 space-x-2">
                                        {/* Enlace de edición */}
                                        <Link
                                            href={route('contacts.edit', contact.id)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </Link>

                                        {/* Botón de eliminación */}
                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this contact?')) {
                                                    router.visit(`/contacts/${contact.id}`, {
                                                    method: 'post',
                                                    data: {
                                                    _method: 'delete', // Laravel lo interpretará como DELETE
                                                },
                                                  onSuccess: () => {
                                                  alert('Contact deleted successfully!');
                                                        },
                                                     onError: () => {
                                                      alert('Error deleting contact.');
                                                      },
                                                    });
                                                }
                                            }}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

