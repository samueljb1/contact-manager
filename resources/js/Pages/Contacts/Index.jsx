import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';

export default function Index() {
    const { contacts, provinces, filters, flash: initialFlash } = usePage().props;

    const [province, setProvince] = useState(filters.province || '');
    const [search, setSearch] = useState(filters.search || '');
    const [flash, setFlash] = useState(initialFlash);

    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', province: '', city: '' });

    const params = { province, search };

    useEffect(() => {
        router.get(route('contacts.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    }, [province, search]);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            const timer = setTimeout(() => setFlash({}), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const exportToCsv = () => {
        const query = new URLSearchParams();
        if (province) query.append('province', province);
        if (search) query.append('search', search);
        window.open(`${route('contacts.export')}?${query.toString()}`, '_blank');
    };

    const startEdit = (contact) => {
        setEditingId(contact.id);
        setEditForm({
            name: contact.name,
            province: contact.province,
            city: contact.city,
        });
    };

    const saveEdit = (contact) => {
        if (
            editForm.name.trim() === '' ||
            editForm.province.trim() === '' ||
            editForm.city.trim() === ''
        ) {
            return; // Evita enviar datos vacíos
        }

        router.visit(route('contacts.update', { contact: contact.id }), {
            method: 'post',
            data: {
                _method: 'put',
                name: editForm.name,
                province: editForm.province,
                city: editForm.city,
            },
            preserveScroll: true,
            onSuccess: () => {
                setEditingId(null);
                setFlash({ success: 'Contact updated successfully.' });
            },
            onError: (err) => {
                alert('Error updating contact.');
                console.error(err);
            },
        });
    };

    const deleteContact = (id) => {
        if (confirm('Are you sure you want to delete this contact?')) {
            router.visit(route('contacts.destroy', { contact: id }), {
                method: 'post',
                data: {
                    _method: 'delete',
                },
                preserveScroll: true,
                onSuccess: () => {
                    setFlash({ success: 'Contact deleted successfully.' });
                },
                onError: (err) => {
                    alert('Error deleting contact.');
                    console.error(err);
                },
            });
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Contacts</h2>}>
            <Head title="Contacts" />

            <div className="py-6 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">

                    {/* Filtros y acciones */}
                    <div className="mb-4 flex flex-wrap gap-4 items-center">
                        <Link
                            href={route('contacts.create')}
                            className="bg-green-600 text-white px-4 py-2 rounded"
                        >
                            + New Contact
                        </Link>

                        <input
                            type="text"
                            placeholder="Search by name"
                            className="border rounded px-3 py-2"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <select
                            className="border rounded px-3 py-2"
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                        >
                            <option value="">-- All Provinces --</option>
                            {provinces.map((prov) => (
                                <option key={prov} value={prov}>{prov}</option>
                            ))}
                        </select>

                        <button
                            onClick={() => {
                                setProvince('');
                                setSearch('');
                            }}
                            className="text-sm text-blue-600 underline"
                        >
                            Clear Filters
                        </button>

                        <button
                            onClick={exportToCsv}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Export to CSV
                        </button>
                    </div>

                    {/* Flash messages */}
                    {flash?.success && (
                        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                            {flash.error}
                        </div>
                    )}

                    {/* Tabla de contactos con edición inline */}
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
                                    {editingId === contact.id ? (
                                        <>
                                            <td>
                                                <input
                                                    value={editForm.name}
                                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                                    className={`border px-2 py-1 rounded w-full ${editForm.name === '' ? 'border-red-500' : 'border-gray-300'}`}
                                                />
                                                {editForm.name === '' && (
                                                    <p className="text-red-500 text-sm mt-1">Name is required.</p>
                                                )}
                                            </td>
                                            <td>
                                                <input
                                                    value={editForm.province}
                                                    onChange={e => setEditForm({ ...editForm, province: e.target.value })}
                                                    className={`border px-2 py-1 rounded w-full ${editForm.province === '' ? 'border-red-500' : 'border-gray-300'}`}
                                                />
                                                {editForm.province === '' && (
                                                    <p className="text-red-500 text-sm mt-1">Province is required.</p>
                                                )}
                                            </td>
                                            <td>
                                                <input
                                                    value={editForm.city}
                                                    onChange={e => setEditForm({ ...editForm, city: e.target.value })}
                                                    className={`border px-2 py-1 rounded w-full ${editForm.city === '' ? 'border-red-500' : 'border-gray-300'}`}
                                                />
                                                {editForm.city === '' && (
                                                    <p className="text-red-500 text-sm mt-1">City is required.</p>
                                                )}
                                            </td>
                                            <td className="space-x-2">
                                                <button
                                                    onClick={() => saveEdit(contact)}
                                                    className="text-green-600 hover:underline"
                                                    disabled={
                                                        editForm.name.trim() === '' ||
                                                        editForm.province.trim() === '' ||
                                                        editForm.city.trim() === ''
                                                    }
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="text-gray-600 hover:underline"
                                                >
                                                    Cancel
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="py-2">{contact.name}</td>
                                            <td className="py-2">{contact.province}</td>
                                            <td className="py-2">{contact.city}</td>
                                            <td className="py-2 space-x-2">
                                                <button
                                                    onClick={() => startEdit(contact)}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteContact(contact.id)}
                                                    className="text-red-600 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </>
                                    )}
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
                                onClick={() =>
                                    link.url &&
                                    router.visit(link.url, {
                                        preserveScroll: true,
                                        preserveState: true,
                                        data: params,
                                    })
                                }
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
