<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $contactsPerProvince = Contact::select('province', DB::raw('count(*) as total'))
            ->groupBy('province')
            ->orderBy('total', 'desc')
            ->get();

        return Inertia::render('Dashboard', [
            'contactsPerProvince' => $contactsPerProvince,
        ]);
    }
}
