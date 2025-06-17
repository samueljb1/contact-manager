import { usePage } from '@inertiajs/react';

export default function FlashMessage() {
    const { flash } = usePage().props;

    if (!flash.success && !flash.error) return null;

    return (
        <div className="mx-auto max-w-7xl px-4 py-2">
            {flash.success && (
                <div className="mb-6 bg-green-100 border border-green-300 text-green-700 px-6 py-3 rounded-lg shadow-md">
                    ✅ {flash.success}
                </div>
            )}
            {flash.error && (
                <div className="mb-6 bg-red-100 border border-red-300 text-red-700 px-6 py-3 rounded-lg shadow-md">
                    ❌ {flash.error}
                </div>
            )}
        </div>
    );
}

