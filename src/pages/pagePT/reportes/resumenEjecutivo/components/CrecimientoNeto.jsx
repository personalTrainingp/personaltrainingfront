import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    BarController,
    LineController
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { Card, Table, Badge } from "react-bootstrap";
import { useCrecimientoNeto } from "../hooks/useCrecimientoNeto";

ChartJS.register(
    CategoryScale, LinearScale, BarElement, PointElement,
    LineElement, Title, Tooltip, Legend, BarController, LineController
);

export const CrecimientoNeto = ({ dataVentas, mapaVencimientos = {}, year, id_empresa }) => {
    const {
        inscritosPorMes,
        renovacionesPorMes,
        churnPorMes,
        netGrowthPorMes,
        churnRatePorMes,
        activosPorMes,
        loadingActivos,
        MESES
    } = useCrecimientoNeto(dataVentas, mapaVencimientos, year, id_empresa);

    const dataChart = {
        labels: MESES,
        datasets: [
            {
                type: "line",
                label: "Crecimiento Neto (Net Growth)",
                data: netGrowthPorMes,
                borderColor: "#0f172a",
                borderWidth: 3,
                borderDash: [5, 5],
                tension: 0.4,
                pointRadius: 4,
                yAxisID: 'y',
                order: 0
            },
            {
                type: "bar",
                label: "Nuevos (Ganancia)",
                data: inscritosPorMes,
                backgroundColor: "rgba(79, 70, 229, 0.8)",
                stack: 'Stack 0',
                order: 1
            },
            {
                type: "bar",
                label: "Renovaciones (Retenidos)",
                data: renovacionesPorMes,
                backgroundColor: "rgba(16, 185, 129, 0.8)",
                stack: 'Stack 0',
                order: 1
            },
            {
                type: "bar",
                label: "Abandono (Churn)",
                data: churnPorMes.map(v => -Math.abs(v)),
                backgroundColor: "rgba(239, 68, 68, 0.8)",
                stack: 'Stack 0',
                order: 1
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: { position: "top", labels: { usePointStyle: true, font: { size: 16 } } },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        let label = context.dataset.label || '';
                        let value = Math.abs(context.raw);
                        return `${label}: ${value}`;
                    }
                }
            }
        },
        scales: {
            x: {
                stacked: true, grid: { display: false },
                ticks: { font: { size: 16 } },
            },
            y: {
                stacked: true,
                grid: { borderDash: [4, 4] },
                ticks: { callback: (v) => Math.abs(v) }
            }
        },
    };

    return (
        <Card className="shadow-sm border-0 rounded-4 mb-5">
            <Card.Header className="bg-white pt-4 px-4 border-0">
                <h5 className="fw-bold m-0 text-dark">ANÁLISIS DE CRECIMIENTO NETO DE MIEMBROS</h5>
                <small className="text-muted">Balance mensual entre adquisición y Churn (fuga) - {year}</small>
            </Card.Header>
            <Card.Body className="px-4 pb-4">
                <div style={{ height: "400px", marginBottom: "2.5rem" }}>
                    <Chart type='bar' data={dataChart} options={options} />
                </div>

                <div className="table-responsive rounded-3 border border-light">
                    <Table hover className="m-0 align-middle">
                        <thead className="bg-light">
                            <tr className="text-secondary text-uppercase fw-bold" style={{ fontSize: '1rem' }}>
                                <th className="py-3 ps-4">Mes</th>
                                <th className="py-3 text-end text-dark">Activos (Fin de Mes)</th>
                                <th className="py-3 text-end text-primary">Nuevos (+)</th>
                                <th className="py-3 text-end text-success">Renovaciones (+)</th>
                                <th className="py-3 text-end text-danger">Churn (-)</th>
                                {/* NUEVA COLUMNA */}
                                <th className="py-3 text-end text-danger">Churn Rate %</th>
                                <th className="py-3 text-center" style={{ backgroundColor: '#fff9c4' }}>CRECIMIENTO NETO</th>
                            </tr>
                        </thead>
                        <tbody style={{ fontSize: '1.3rem' }}>
                            {MESES.map((mes, i) => {
                                const net = netGrowthPorMes[i];
                                const rate = parseFloat(churnRatePorMes[i] || 0);

                                // Semántica de colores para el Churn Rate (Más de 50% fuga es crítico)
                                let rateColor = "text-muted";
                                if (rate > 50) rateColor = "text-danger fw-bold";
                                else if (rate > 20) rateColor = "text-warning fw-bold";
                                else if (rate > 0) rateColor = "text-success fw-bold";

                                return (
                                    <tr key={mes} className="border-bottom border-light">
                                        <td className="ps-4 fw-bold text-secondary text-uppercase ">{mes}</td>
                                        <td className="text-end fw-bold text-dark">
                                            {loadingActivos ? '...' : (activosPorMes[i] || '-')}
                                        </td>
                                        <td className="text-end fw-semibold">{inscritosPorMes[i] || '-'}</td>
                                        <td className="text-end fw-semibold text-success">{renovacionesPorMes[i] || '-'}</td>
                                        <td className="text-end fw-semibold text-danger">{churnPorMes[i] || '-'}</td>

                                        {/* NUEVA CELDA CHURN RATE */}
                                        <td className={`text-end ${rateColor}`}>
                                            {rate > 0 ? `${rate}%` : '-'}
                                        </td>

                                        <td className="text-center">
                                            <Badge bg={net > 0 ? 'success' : net < 0 ? 'danger' : 'light'}
                                                text={net === 0 ? 'dark' : 'light'}
                                                className="px-3 py-2 rounded-pill shadow-sm">
                                                {net > 0 ? `+${net}` : net === 0 ? '0' : net}
                                            </Badge>
                                        </td>
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