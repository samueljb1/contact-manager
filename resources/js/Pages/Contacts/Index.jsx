import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';

export default function Index() {
    const { contacts, provinces, filters, flash: initialFlash } = usePage().props;

    const [province, setProvince] = useState(filters.province || '');
    const [search, setSearch] = useState(filters.search || '');
    const [city, setCity] = useState(filters.city || '');
    const [from, setFrom] = useState(filters.from || '');
    const [to, setTo] = useState(filters.to || '');
    const [flash, setFlash] = useState(initialFlash);

    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', province: '', city: '' });

    const params = { search, province, city, from, to };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            router.get(route('contacts.index'), params, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }
    }, [search, province, city, from, to]);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            const timer = setTimeout(() => setFlash({}), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const exportToCsv = () => {
        const query = new URLSearchParams(params).toString();
        window.open(`${route('contacts.export')}?${query}`, '_blank');
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
        if (!editForm.name.trim() || !editForm.province.trim() || !editForm.city.trim()) return;

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
            onError: () => alert('Error updating contact.'),
        });
    };

    const deleteContact = (id) => {
        if (confirm('Are you sure you want to delete this contact?')) {
            router.visit(route('contacts.destroy', { contact: id }), {
                method: 'post',
                data: { _method: 'delete' },
                preserveScroll: true,
                onSuccess: () => setFlash({ success: 'Contact deleted successfully.' }),
                onError: () => alert('Error deleting contact.'),
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center w-full">
                    <h2 className="text-2xl font-bold text-gray-800">Contacts</h2>
                </div>
            }
        >
            <Head title="Contacts" />

            <div className="py-6 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white p-6 rounded shadow">

                    {/* Botones "New Contact" y "Export CSV" encima de los filtros */}
                    <div className="flex space-x-4 mb-6">
                        <Link
                            href={route('contacts.create')}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
                        >
                            + New Contact
                        </Link>
                        <button
                            onClick={exportToCsv}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                        >
                            Export CSV
                        </button>
                    </div>

                    {/* Filtros */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Search name"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="border rounded px-3 py-2 w-full"
                        />
                        <select
                            value={province}
                            onChange={e => setProvince(e.target.value)}
                            className="border rounded px-3 py-2 w-full"
                        >
                            <option value="">All Provinces</option>
                            {provinces.map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="City"
                            value={city}
                            onChange={e => setCity(e.target.value)}
                            className="border rounded px-3 py-2 w-full"
                        />
                        <input
                            type="date"
                            value={from}
                            onChange={e => setFrom(e.target.value)}
                            className="border rounded px-3 py-2 w-full"
                        />
                        <input
                            type="date"
                            value={to}
                            onChange={e => setTo(e.target.value)}
                            className="border rounded px-3 py-2 w-full"
                        />
                    </div>

                    {/* Flash Messages */}
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

                    {/* Tabla */}
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
                                            <td><input className="border rounded w-full" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} /></td>
                                            <td><input className="border rounded w-full" value={editForm.province} onChange={e => setEditForm({ ...editForm, province: e.target.value })} /></td>
                                            <td><input className="border rounded w-full" value={editForm.city} onChange={e => setEditForm({ ...editForm, city: e.target.value })} /></td>
                                            <td>
                                                <button onClick={() => saveEdit(contact)} className="text-green-600 hover:underline">Save</button>
                                                <button onClick={() => setEditingId(null)} className="text-gray-600 hover:underline ml-2">Cancel</button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="py-2">{contact.name}</td>
                                            <td className="py-2">{contact.province}</td>
                                            <td className="py-2">{contact.city}</td>
                                            <td className="py-2 space-x-2">
                                                <button onClick={() => startEdit(contact)} className="text-blue-600 hover:underline">Edit</button>
                                                <button onClick={() => deleteContact(contact.id)} className="text-red-600 hover:underline">Delete</button>
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


