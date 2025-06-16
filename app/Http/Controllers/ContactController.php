<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ContactController extends Controller
{
    // Mostrar lista de contactos junto con provincias únicas
    public function index()
    {
        $contacts = Contact::latest()->paginate(10);

        $provinces = Contact::select('province')
            ->distinct()
            ->orderBy('province')
            ->pluck('province');

        return Inertia::render('Contacts/Index', [
            'contacts' => $contacts,
            'provinces' => $provinces,
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

    // Exporta los contactos en formato CSV con opción a filtrar por provincia
    public function export(Request $request): StreamedResponse
    {
        $filename = 'contacts.csv';

        return response()->streamDownload(function () use ($request) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ID', 'Name', 'Province', 'City', 'Created At']);

            $query = Contact::query();

            // Filtrar por provincia si se pasa parámetro
            if ($request->has('province') && $request->province !== '') {
                $query->where('province', $request->province);
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
