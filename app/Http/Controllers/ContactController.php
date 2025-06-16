<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ContactController extends Controller
{
    // Mostrar lista de contactos con filtro por provincia y búsqueda por nombre
    public function index(Request $request)
    {
        $query = Contact::query();

        if ($request->filled('province')) {
            $query->where('province', $request->province);
        }

        // Búsqueda insensible a mayúsculas (solo funciona en PostgreSQL)
        if ($request->filled('search')) {
            $query->where('name', 'ILIKE', '%' . $request->search . '%');
        }

        $contacts = $query->latest()->paginate(10)->withQueryString();

        $provinces = Contact::select('province')
            ->distinct()
            ->orderBy('province')
            ->pluck('province');

        return Inertia::render('Contacts/Index', [
            'contacts' => $contacts,
            'provinces' => $provinces,
            'filters' => $request->only(['province', 'search']),
        ]);
    }

    // Muestra el formulario para crear un nuevo contacto
    public function create()
    {
        return Inertia::render('Contacts/Create');
    }

    // Guarda un nuevo contacto en la base de datos
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'city' => 'required|string|max:255',
        ]);

        Contact::create($request->only('name', 'province', 'city'));

        return redirect()->route('contacts.index')->with('success', 'Contact created successfully.');
    }

    // Muestra el formulario para editar un contacto
    public function edit(Contact $contact)
    {
        return Inertia::render('Contacts/Edit', [
            'contact' => $contact,
        ]);
    }

    // Actualiza el contacto en la base de datos
    public function update(Request $request, Contact $contact)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'city' => 'required|string|max:255',
        ]);

        $contact->update($request->only('name', 'province', 'city'));

        return redirect()->route('contacts.index')->with('success', 'Contact updated successfully.');
    }

    // Elimina el contacto de la base de datos
    public function destroy(Contact $contact)
    {
        $contact->delete();

        return redirect()->route('contacts.index')->with('success', 'Contact deleted.');
    }

    // Exporta los contactos en formato CSV con opción a filtrar por provincia y búsqueda
    public function export(Request $request): StreamedResponse
    {
        $filename = 'contacts.csv';

        return response()->streamDownload(function () use ($request) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ID', 'Name', 'Province', 'City', 'Created At']);

            $query = Contact::query();

            if ($request->filled('province')) {
                $query->where('province', $request->province);
            }

            // También insensible a mayúsculas en la exportación
            if ($request->filled('search')) {
                $query->where('name', 'ILIKE', '%' . $request->search . '%');
            }

            foreach ($query->get() as $contact) {
                fputcsv($handle, [
                    $contact->id,
                    $contact->name,
                    $contact->province,
                    $contact->city,
                    $contact->created_at->format('Y-m-d H:i:s'),
                ]);
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }
}
