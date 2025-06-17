<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Contactos por provincia
        $contactsPerProvince = Contact::select('province', DB::raw('count(*) as total'))
            ->groupBy('province')
            ->orderBy('total', 'desc')
            ->get();

        // Contactos creados por fecha (últimos 15 días)
        $contactsByDate = Contact::select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as total'))
            ->groupBy('date')
            ->orderBy('date')
            ->take(15)
            ->get();

        // KPIs adicionales
        $totalContacts = Contact::count();
        $totalProvinces = Contact::distinct('province')->count('province');
        $totalCities = Contact::distinct('city')->count('city');

        return Inertia::render('Dashboard', [
            'contactsPerProvince' => $contactsPerProvince,
            'contactsByDate' => $contactsByDate,
            'totalContacts' => $totalContacts,
            'totalProvinces' => $totalProvinces,
            'totalCities' => $totalCities,
        ]);
    }
}
