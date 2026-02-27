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
    BarController,  // <-- ¡AGREGADO AQUÍ!
    LineController
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { Card, Table, Spinner, Badge } from "react-bootstrap";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarController,
    LineController
);



import { useSeguimientoRenovaciones } from "../hooks/useSeguimientoRenovaciones";

export const SeguimientoRenovaciones = ({
    dataVentas,
    mapaVencimientos = {},
    year,
    id_empresa,
    cutDay = null,
    cutMonth = null,
}) => {
    const {
        inscritosPorMes,
        renovacionesPorMes,
        activosPorMes,
        loadingActivos,
        MESES
    } = useSeguimientoRenovaciones(dataVentas, mapaVencimientos, year, id_empresa, cutDay, cutMonth);

    // MEJORA UI: Paleta de colores moderna y bordes redondeados
    const dataChart = {
        labels: MESES,
        datasets: [
            {
                type: "bar",
                label: "Inscritos (Nuevos)",
                data: inscritosPorMes,
                backgroundColor: "rgba(99, 102, 241, 0.8)", // Índigo moderno
                borderColor: "rgba(99, 102, 241, 1)",
                borderWidth: 1,
                borderRadius: 4, // Bordes redondeados en barras
                barPercentage: 0.6,
            },
            {
                type: "line",
                label: "Activos (Vigentes)",
                data: MESES.map((_, i) => activosPorMes[i] || 0),
                borderColor: "#10B981", // Esmeralda
                backgroundColor: "#10B981",
                borderWidth: 3,
                fill: false,
                tension: 0.4, // Curva suave
                pointRadius: 4,
                pointHoverRadius: 6,
                yAxisID: 'y1',
            },
            {
                type: "bar",
                label: "Renovaciones",
                data: renovacionesPorMes,
                backgroundColor: "rgba(245, 158, 11, 0.8)", // Ámbar
                borderColor: "rgba(245, 158, 11, 1)",
                borderWidth: 1,
                borderRadius: 4,
                barPercentage: 0.6,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Importante para que respete el contenedor
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            title: { display: false }, // Ocultamos el título nativo del gráfico para usar el del Card
            legend: {
                position: "top",
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: { family: "'Inter', sans-serif", size: 13 }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                titleFont: { size: 14 },
                bodyFont: { size: 13 },
                padding: 12,
                cornerRadius: 8,
            }
        },
        scales: {
            x: {
                grid: { display: false },
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                grid: { borderDash: [4, 4] }, // Líneas punteadas elegantes
                title: { display: true, text: 'Nuevos / Renov.' }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: { drawOnChartArea: false },
                title: { display: true, text: 'Usuarios Activos' }
            },
        },
    };

    return (
        <Card className="shadow-sm border-0 rounded-3 mb-4">
            <Card.Header className="bg-white border-bottom-0 pt-4 pb-2 px-4">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="m-0 fw-bold text-dark">Seguimiento Mensual de Membresías</h5>
                        <small className="text-muted">Inscritos, activos y renovaciones del año {year}</small>
                    </div>
                </div>
            </Card.Header>
            <Card.Body className="px-4 pb-4">
                <div style={{ height: "350px", width: "100%", marginBottom: "2.5rem" }}>
                    <Chart type='bar' data={dataChart} options={options} />
                </div>

                <div className="table-responsive rounded border">
                    {/* MEJORA UI: Tabla más limpia, textos alineados donde corresponden */}
                    <Table hover responsive className="m-0 align-middle">
                        <thead className="bg-light text-primary" style={{ fontSize: "1rem", textTransform: "uppercase" }}>
                            <tr className="bg-primary">
                                <th className="py-3 ps-3 text-white">Mes</th>
                                <th className="py-3 text-start text-white">Inscritos<br /> Nuevos</th>
                                <th className="py-3 text-start text-white">Activos<br /> (Fin de Mes)</th>
                                <th className="py-3 text-start text-white">Renovaciones</th>
                                <th className="py-3 text-start pe-3 text-white">Ratio<br /> Renovación</th>
                            </tr>
                        </thead>
                        <tbody style={{ borderTop: "none", fontSize: "1.2rem" }}>
                            {MESES.map((mes, i) => {
                                const inscritos = inscritosPorMes[i];
                                const activos = activosPorMes[i] || 0;
                                const renovaciones = renovacionesPorMes[i];

                                const ratio = activos > 0 ? ((renovaciones / activos) * 100).toFixed(1) : "0.0";
                                const numRatio = parseFloat(ratio);

                                return (
                                    <tr key={mes}>
                                        <td className="ps-3 fw-semibold text-secondary">{mes}</td>
                                        <td className="text-end fw-medium">{inscritos > 0 ? inscritos : '-'}</td>
                                        <td className="text-end fw-medium text-primary">
                                            {loadingActivos ? (
                                                <Spinner animation="border" size="sm" className="text-muted" />
                                            ) : (
                                                activos > 0 ? activos : '-'
                                            )}
                                        </td>
                                        <td className="text-end fw-medium">{renovaciones > 0 ? renovaciones : '-'}</td>
                                        <td className="text-end pe-3">
                                            <Badge
                                                bg={numRatio > 5 ? 'success' : numRatio > 0 ? 'warning' : 'light'}
                                                text={numRatio === 0 ? 'dark' : 'light'}
                                                className="px-2 py-1 rounded-pill"
                                            >
                                                {ratio}%
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