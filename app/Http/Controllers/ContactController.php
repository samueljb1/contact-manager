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
}
