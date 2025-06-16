import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';

export default function Index() {
    const { contacts, provinces, filters } = usePage().props;
    const [province, setProvince] = useState(filters.province || '');
    const [search, setSearch] = useState(filters.search || '');

    // Ejecuta el filtro automáticamente cuando cambian los valores
    useEffect(() => {
        router.get(route('contacts.index'), {
            province,
            search,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    }, [province, search]);

    const exportToCsv = () => {
        const query = new URLSearchParams();
        if (province) query.append('province', province);
        if (search) query.append('search', search);
        window.open(`${route('contacts.export')}?${query.toString()}`, '_blank');
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Contacts</h2>}>
            <Head title="Contacts" />

            <div className="py-6 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">

                    {/* Enlaces y filtros */}
                    <div className="mb-4 flex flex-wrap gap-4 items-center">
                        <Link
                            href={route('contacts.create')}
                            className="bg-green-600 text-white px-4 py-2 rounded"
                        >
                            + New Contact
                        </Link>

                        {/* Select dinámico de provincias */}
                        <select
                            className="border rounded px-3 py-2"
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                        >
                            <option value="">-- All Provinces --</option>
                            {provinces.map((prov) => (
                                <option key={prov} value={prov}>
                                    {prov}
                                </option>
                            ))}
                        </select>

                        {/* Campo de búsqueda */}
                        <input
                            type="text"
                            placeholder="Search by name"
                            className="border rounded px-3 py-2"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        {/* Botón para limpiar filtros */}
                        <button
                            onClick={() => {
                                setProvince('');
                                setSearch('');
                            }}
                            className="text-sm text-blue-600 underline"
                        >
                            Clear Filters
                        </button>

                        {/* Botón para exportar CSV */}
                        <button
                            onClick={exportToCsv}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Export to CSV
                        </button>
                    </div>

                    {/* Tabla de contactos */}
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="text-left">Name</th>
                                <th className="text-left">Province</th>
                                <th className="text-left">City</th>
                                <th className="text-left">Actions</th>
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
                                                if (confirm('Are you sure you want to delete this contact?')) {
                                                    router.visit(`/contacts/${contact.id}`, {
                                                        method: 'post',
                                                        data: {
                                                            _method: 'delete',
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

                    {/* Paginación */}
                    <div className="mt-4 flex justify-center space-x-2">
                        {contacts.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url)}
                                className={`px-3 py-1 border rounded text-sm ${
                                    link.active
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
