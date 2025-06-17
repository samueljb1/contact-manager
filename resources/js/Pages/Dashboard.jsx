import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function Dashboard({ contactsPerProvince }) {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!contactsPerProvince || contactsPerProvince.length === 0) return;

        const ctx = chartRef.current.getContext('2d');

        // Destruir gráfica anterior si existe
        if (chartRef.current.chart) {
            chartRef.current.chart.destroy();
        }

        chartRef.current.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: contactsPerProvince.map(item => item.province),
                datasets: [{
                    label: 'Contacts per Province',
                    data: contactsPerProvince.map(item => item.total),
                    backgroundColor: 'rgba(37, 99, 235, 0.5)',
                    borderColor: 'rgba(37, 99, 235, 1)',
                    borderWidth: 1,
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
    }, [contactsPerProvince]);

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>}>
            <Head title="Dashboard" />

            <div className="py-6 max-w-4xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-lg font-bold mb-4">Contacts per Province</h3>
                    <canvas ref={chartRef} height={300}></canvas>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

