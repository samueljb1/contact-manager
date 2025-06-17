import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Chart, registerables } from 'chart.js';
import { useEffect, useRef } from 'react';

Chart.register(...registerables);

export default function Dashboard({ contactsPerProvince, contactsByDate, totalContacts, totalProvinces, totalCities }) {
    const barRef = useRef(null);
    const lineRef = useRef(null);

    useEffect(() => {
        // Gráfico de barras (provincia)
        if (barRef.current && contactsPerProvince.length > 0) {
            new Chart(barRef.current, {
                type: 'bar',
                data: {
                    labels: contactsPerProvince.map(p => p.province),
                    datasets: [{
                        label: 'Contacts per Province',
                        data: contactsPerProvince.map(p => p.total),
                        backgroundColor: '#3B82F6',
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                precision: 0
                            }
                        }
                    }
                }
            });
        }

        // Gráfico de línea (por fecha)
        if (lineRef.current && contactsByDate.length > 0) {
            new Chart(lineRef.current, {
                type: 'line',
                data: {
                    labels: contactsByDate.map(d => d.date),
                    datasets: [{
                        label: 'Contacts Created',
                        data: contactsByDate.map(d => d.total),
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                        fill: true,
                        tension: 0.3,
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                precision: 0
                            }
                        }
                    }
                }
            });
        }
    }, [contactsPerProvince, contactsByDate]);

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>}>
            <Head title="Dashboard" />

            <div className="py-6 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-10">
                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded shadow text-center">
                        <div className="text-2xl font-bold text-blue-600">{totalContacts}</div>
                        <div className="text-gray-600">Total Contacts</div>
                    </div>
                    <div className="bg-white p-6 rounded shadow text-center">
                        <div className="text-2xl font-bold text-green-600">{totalProvinces}</div>
                        <div className="text-gray-600">Unique Provinces</div>
                    </div>
                    <div className="bg-white p-6 rounded shadow text-center">
                        <div className="text-2xl font-bold text-purple-600">{totalCities}</div>
                        <div className="text-gray-600">Unique Cities</div>
                    </div>
                </div>

                {/* Gráfico de barras por provincia */}
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-lg font-semibold mb-4">Contacts per Province</h3>
                    <canvas ref={barRef} height="120"></canvas>
                </div>

                {/* Gráfico de línea por fecha */}
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-lg font-semibold mb-4">Contacts over Time</h3>
                    <canvas ref={lineRef} height="120"></canvas>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
