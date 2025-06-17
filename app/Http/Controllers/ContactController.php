<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ContactController extends Controller
{
    // Mostrar lista de contactos con filtro por provincia, ciudad, búsqueda por nombre, y fecha
    public function index(Request $request)
    {
        $query = Contact::query();

        // Filtro por provincia
        if ($request->filled('province')) {
            $query->where('province', $request->province);
        }

        // Filtro por búsqueda de nombre (insensible a mayúsculas en PostgreSQL)
        if ($request->filled('search')) {
            $query->where('name', 'ILIKE', '%' . $request->search . '%');
        }

        // Filtro por ciudad
        if ($request->filled('city')) {
            $query->where('city', 'ILIKE', '%' . $request->city . '%');
        }

        // Filtro por fecha de inicio
        if ($request->filled('from')) {
            $query->whereDate('created_at', '>=', $request->from);
        }

        // Filtro por fecha de fin
        if ($request->filled('to')) {
            $query->whereDate('created_at', '<=', $request->to);
        }

        // Obtener los contactos con la paginación
        $contacts = $query->latest()->paginate(10)->withQueryString();

        // Obtener las provincias disponibles para el filtro
        $provinces = Contact::select('province')
            ->distinct()
            ->orderBy('province')
            ->pluck('province');

        return Inertia::render('Contacts/Index', [
            'contacts' => $contacts,
            'provinces' => $provinces,
            'filters' => $request->only(['search', 'province', 'city', 'from', 'to']),
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

    // Exporta los contactos en formato CSV con opción a filtrar por provincia, búsqueda, ciudad y fechas
    public function export(Request $request): StreamedResponse
    {
        $filename = 'contacts.csv';

        return response()->streamDownload(function () use ($request) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ID', 'Name', 'Province', 'City', 'Created At']);

            $query = Contact::query();

            // Filtro por provincia
            if ($request->filled('province')) {
                $query->where('province', $request->province);
            }

            // Filtro por búsqueda de nombre (insensible a mayúsculas en PostgreSQL)
            if ($request->filled('search')) {
                $query->where('name', 'ILIKE', '%' . $request->search . '%');
            }

            // Filtro por ciudad
            if ($request->filled('city')) {
                $query->where('city', 'ILIKE', '%' . $request->city . '%');
            }

            // Filtro por fecha de inicio
            if ($request->filled('from')) {
                $query->whereDate('created_at', '>=', $request->from);
            }

            // Filtro por fecha de fin
            if ($request->filled('to')) {
                $query->whereDate('created_at', '<=', $request->to);
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
