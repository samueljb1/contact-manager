import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';

export default function Index() {
    const { contacts } = usePage().props;

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Contacts</h2>}>
            <Head title="Contacts" />

            <div className="py-6 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">

                    {/* Enlace para crear nuevo contacto */}
                    <Link
                        href={route('contacts.create')}
                        className="bg-green-600 text-white px-4 py-2 rounded mb-4 inline-block"
                    >
                        + New Contact
                    </Link>

                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="text-left">Name</th>
                                <th className="text-left">Province</th>
                                <th className="text-left">City</th>
                                <th className="text-left">Actions</th> {/* Nueva columna */}
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.data.map((contact) => (
                                <tr key={contact.id}>
                                    <td className="py-2">{contact.name}</td>
                                    <td className="py-2">{contact.province}</td>
                                    <td className="py-2">{contact.city}</td>
                                    <td className="py-2 space-x-2">
                                        <Link
                                            href={route('contacts.edit', contact.id)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure?')) {
                                                    router.delete(route('contacts.destroy', contact.id));
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
