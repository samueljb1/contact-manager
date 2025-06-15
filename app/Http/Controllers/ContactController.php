<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index()
    {
        $contacts = Contact::latest()->paginate(10);

        return Inertia::render('Contacts/Index', [
            'contacts' => $contacts,
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
}

