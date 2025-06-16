import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ contact }) {
    const { data, setData, put, processing, errors } = useForm({
        name: contact.name,
        province: contact.province,
        city: contact.city,
    });

    const submit = (e) => {
        e.preventDefault();

        // Usa route() para generar la URL de forma dinámica
        put(route('contacts.update', contact.id), {
            onSuccess: () => {
                console.log('Updated!');
            },
            onError: () => {
                console.log('Error updating contact');
            },
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Edit Contact</h2>}>
            <Head title="Edit Contact" />

            <div className="py-6 max-w-2xl mx-auto sm:px-6 lg:px-8">
                <form onSubmit={submit} className="bg-white p-6 rounded shadow">
                    <div className="mb-4">
                        <label className="block text-gray-700">Name</label>
                        <input
                            type="text"
                            className="w-full border p-2"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Province</label>
                        <input
                            type="text"
                            className="w-full border p-2"
                            value={data.province}
                            onChange={(e) => setData('province', e.target.value)}
                        />
                        {errors.province && <p className="text-red-500 text-sm">{errors.province}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">City</label>
                        <input
                            type="text"
                            className="w-full border p-2"
                            value={data.city}
                            onChange={(e) => setData('city', e.target.value)}
                        />
                        {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                        disabled={processing}
                    >
                        Update Contact
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}

