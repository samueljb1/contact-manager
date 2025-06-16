import { usePage } from '@inertiajs/react';

export default function FlashMessage() {
    const { flash } = usePage().props;

    if (!flash.success && !flash.error) return null;

    return (
        <div className="mx-auto max-w-7xl px-4 py-2">
            {flash.success && (
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4">
                    {flash.success}
                </div>
            )}
            {flash.error && (
                <div className="bg-red-100 text-red-800 px-4 py-2 rounded mb-4">
                    {flash.error}
                </div>
            )}
        </div>
    );
}

