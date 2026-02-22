import React, { useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    BarController,
    LineController
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { Card, Table, Badge } from 'react-bootstrap';
import { useCrecimientoNeto } from '../hooks/useCrecimientoNeto';
import { MESES } from '../hooks/useResumenUtils';
import { aliasMes } from '../adapters/executibleLogic';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    BarController,
    LineController
);

export const LtvCacChart = ({
    dataVentas,
    mapaVencimientos,
    dataMktByMonth,
    year,
    id_empresa
}) => {
    // 1. Obtener Churn Rate mensual usando el hook existente
    const { churnRatePorMes } = useCrecimientoNeto(dataVentas, mapaVencimientos, year, id_empresa);

    const metrics = useMemo(() => {
        const cacData = Array(12).fill(0);
        const ltvData = Array(12).fill(0);
        const ratioData = Array(12).fill(0);
        const ticketsData = Array(12).fill(0);

        MESES.forEach((mesLabel, index) => {
            const mesNorm = aliasMes(mesLabel);
            const key = `${year}-${mesNorm}`;

            // --- CAC Calculation ---
            const mktData = dataMktByMonth?.[key] || {};

            // Inversión Total (Soles)
            // Aseguramos que tomamos el valor correcto. A veces viene como 'inversiones_redes' o 'inversion_redes'
            const inversionRaw = Number(mktData.inversiones_redes || mktData.inversion_redes || mktData.inv || 0);

            // Clientes Digitales
            const clientesDigitales = Number(mktData.clientes_digitales || 0);

            let cac = 0;
            if (clientesDigitales > 0) {
                cac = inversionRaw / clientesDigitales;
            }
            cacData[index] = Number(cac.toFixed(2));

            // --- LTV Calculation ---
            // Ticket Promedio del mes (SOLO Membresías para LTV más puro)
            const ventasMes = dataVentas.filter(v => {
                const d = new Date(v.fecha_venta || v.createdAt);
                return d.getFullYear() === year && d.getMonth() === index;
            });

            // Filtramos ventas que tengan items de membresía
            const ventasMembresia = ventasMes.filter(v =>
                (v.detalle_ventaMembresia?.length > 0 || v.detalle_venta_membresia?.length > 0)
            );

            let totalVentaMem = 0;
            let cantidadVentaMem = 0;

            ventasMembresia.forEach(v => {
                const items = v.detalle_ventaMembresia || v.detalle_venta_membresia || [];
                items.forEach(item => {
                    totalVentaMem += Number(item.tarifa_monto || item.monto || 0);
                    cantidadVentaMem += Number(item.cantidad || 1);
                });
            });

            const ticketPromedio = cantidadVentaMem > 0 ? totalVentaMem / cantidadVentaMem : 0;
            ticketsData[index] = ticketPromedio;

            // Churn Rate % (ya viene calculado en el hook, ej: 5.5)
            const churnRateVal = Number(churnRatePorMes[index] || 0);
            const churnRateDecimal = churnRateVal / 100;

            let ltv = 0;
            if (churnRateDecimal > 0) {
                ltv = ticketPromedio / churnRateDecimal;
            } else if (ticketPromedio > 0) {
                // Si Churn es 0, LTV teórico infinito. Ponemos 0 para no romper gráfica.
                ltv = 0;
            }
            ltvData[index] = Number(ltv.toFixed(2));

            // --- Ratio ---
            let ratio = 0;
            if (cac > 0) {
                ratio = ltv / cac;
            }
            ratioData[index] = Number(ratio.toFixed(2));
        });

        return { cacData, ltvData, ratioData, ticketsData };
    }, [dataVentas, dataMktByMonth, churnRatePorMes, year]);

    const chartData = {
        labels: MESES,
        datasets: [
            {
                type: 'bar',
                label: 'LTV (Valor de Vida)',
                data: metrics.ltvData,
                backgroundColor: 'rgba(16, 185, 129, 0.6)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 1,
                yAxisID: 'y',
                order: 2
            },
            {
                type: 'bar',
                label: 'CAC (Costo Adquisición)',
                data: metrics.cacData,
                backgroundColor: 'rgba(239, 68, 68, 0.6)',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 1,
                yAxisID: 'y',
                order: 3
            },
            {
                type: 'line',
                label: 'Ratio LTV/CAC',
                data: metrics.ratioData,
                borderColor: '#6366f1',
                backgroundColor: '#6366f1',
                borderWidth: 3,
                pointRadius: 4,
                yAxisID: 'y1',
                tension: 0.3,
                order: 1
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: { position: 'top' },
            tooltip: {
                callbacks: {
                    label: (ctx) => {
                        const label = ctx.dataset.label || '';
                        const val = Number(ctx.raw || 0);
                        if (label.includes('Ratio')) return `Ratio: ${val}x`;
                        return `${label}: S/ ${val.toLocaleString('es-PE', { minimumFractionDigits: 0 })}`;
                    }
                }
            },
            title: { display: false }
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: { display: true, text: 'Monto (S/.)' },
                grid: { borderDash: [4, 4] },
                beginAtZero: true
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: { display: true, text: 'Ratio (Veces)' },
                grid: { drawOnChartArea: false },
                min: 0,
                // max: 15 // Dejar dinámico
            },
            x: {
                grid: { display: false }
            }
        }
    };

    return (
        <Card className="shadow-sm border-0 rounded-4 mb-5">
            <Card.Header className="bg-white pt-4 px-4 border-0">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <div>
                        <h5 className="fw-bold m-0 text-dark">ANÁLISIS LTV vs CAC</h5>
                        <small className="text-muted">Marketing: El LTV debe ser mayor a 3 veces el CAC</small>
                    </div>
                </div>
            </Card.Header>
            <Card.Body className="px-4 pb-4">
                <div style={{ height: '400px', marginBottom: '2rem' }}>
                    <Chart type='bar' data={chartData} options={options} />
                </div>

                <div className="table-responsive rounded-3 border border-light">
                    <Table hover className="m-0 align-middle">
                        <thead className="bg-primary">
                            <tr className="text-secondary text-uppercase fw-bold" style={{ fontSize: '0.9rem' }}>
                                <th className="py-3 ps-4 text-white">Mes</th>
                                <th className="py-3 text-start text-white">Ticket<br /> Promedio</th>
                                <th className="py-3 text-start text-white">Churn<br /> Rate</th>
                                <th className="py-3 text-end text-success text-white">LTV (S/.)</th>
                                <th className="py-3 text-end text-danger text-white">CAC (S/.)</th>
                                <th className="py-3 text-center text-white">Ratio</th>
                                <th className="py-3 text-center text-white">Estado</th>
                            </tr>
                        </thead>
                        <tbody style={{ fontSize: '1.3rem' }}>
                            {MESES.map((mes, i) => {
                                const ltv = metrics.ltvData[i];
                                const cac = metrics.cacData[i];
                                const ratio = metrics.ratioData[i];
                                const churn = churnRatePorMes[i];
                                const ticket = metrics.ticketsData[i];

                                if (ltv === 0 && cac === 0 && ticket === 0) return null;

                                let statusBadge;
                                if (ratio >= 3) statusBadge = <Badge bg="success" className="px-3">Sano</Badge>;
                                else if (ratio >= 1) statusBadge = <Badge bg="warning" text="dark" className="px-3">Alerta</Badge>;
                                else statusBadge = <Badge bg="danger" className="px-3">Crítico</Badge>;

                                return (
                                    <tr key={mes} className="border-bottom border-light">
                                        <td className="ps-4 fw-bold text-secondary text-uppercase">{mes}</td>
                                        <td className="text-end">S/ {ticket.toLocaleString('es-PE', { maximumFractionDigits: 0 })}</td>
                                        <td className="text-end">{churn > 0 ? `${churn}%` : '-'}</td>
                                        <td className="text-end fw-bold text-success">S/ {ltv.toLocaleString('es-PE', { maximumFractionDigits: 0 })}</td>
                                        <td className="text-end fw-bold text-danger">S/ {cac.toLocaleString('es-PE', { maximumFractionDigits: 0 })}</td>
                                        <td className="text-center fw-bold">{ratio}x</td>
                                        <td className="text-center">{statusBadge}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div>
            </Card.Body>
        </Card>
    );
};
