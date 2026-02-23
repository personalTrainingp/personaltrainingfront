import React from 'react';
import { Card, Table, ProgressBar, Badge } from 'react-bootstrap';
import { useConversionEfficiency } from '../hooks/useConversionEfficiency';
import { MESES } from '../hooks/useResumenUtils';

export const ConversionEfficiencyTable = ({
    ventas = [],
    dataMktWithCac = {},
    dataLead = [],
    selectedMonth,
    year,
    initDay,
    cutDay
}) => {
    const dataTable = useConversionEfficiency({
        ventas, dataMktWithCac, dataLead, selectedMonth, year, initDay, cutDay
    });

    const filteredData = dataTable.filter(row => row.ventas > 0 || row.leads > 0);

    // Helpers visuales
    const getPlatformColor = (origen) => {
        const originMap = {
            'Meta': '#1877F2',
            'TikTok': '#000000', // TikTok resalta mejor en negro sobre fondo blanco
            'Instagram': '#E1306C',
            'Facebook': '#1877F2',
            'Referidos': '#10b981',
            'Renovaciones': '#f59e0b'
        };
        return originMap[origen] || '#6c757d';
    };

    const getRoiStatus = (roi) => {
        if (roi >= 3) return { color: '#059669', bg: 'rgba(16, 185, 129, 0.15)', text: 'Excelente' };
        if (roi >= 1) return { color: '#d97706', bg: 'rgba(245, 158, 11, 0.15)', text: 'Regular' };
        return { color: '#dc2626', bg: 'rgba(239, 68, 68, 0.15)', text: 'Pérdida' };
    };

    return (
        <Card className="shadow-sm mb-4" style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0" }}>

            {/* HEADER */}
            <Card.Header className="pt-4 pb-3" style={{ backgroundColor: "#000000", borderBottom: "1px solid #f1f5f9" }}>
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h4 className="m-0 text-white d-flex align-items-center gap-2" style={{ fontSize: "1.1rem", fontWeight: "700" }}>
                            <i className="bi bi-funnel-fill" style={{ color: "#c00000" }}></i>
                            Eficiencia de Conversión y Embudo
                        </h4>
                        <p className="text-white mb-0 mt-1" style={{ fontSize: "0.85rem" }}>
                            Rendimiento detallado por origen y plataformas publicitarias
                        </p>
                    </div>
                    <div>
                        <Badge bg="light" text="dark fs-7" className="px-3 py-2 border rounded-pill shadow-sm">
                            <i className="bi bi-calendar3 me-2 text-muted"></i>
                            {`${initDay || 1} al ${cutDay || 31} de ${MESES[selectedMonth - 1]} / ${year}`}
                        </Badge>
                    </div>
                </div>
            </Card.Header>

            {/* BODY / TABLE */}
            <Card.Body className="p-0">
                <div className="table-responsive">
                    {/* Al quitar el "variant", Bootstrap usa su estilo claro por defecto */}
                    <Table hover className="m-0 align-middle text-nowrap w-100">
                        <thead style={{ backgroundColor: "#c00000", borderBottom: "2px solid #e2e8f0", color: "white" }}>
                            <tr>
                                <th className="text-uppercase text-white py-3 ps-4" style={{ fontSize: '1rem', fontWeight: '700', letterSpacing: '0.5px' }}>Origen</th>
                                <th className="text-uppercase text-white text-center py-3" style={{ fontSize: '1rem', fontWeight: '700', letterSpacing: '0.5px' }}>Leads </th>
                                <th className="text-uppercase text-white text-center py-3" style={{ fontSize: '1rem', fontWeight: '700', letterSpacing: '0.5px' }}>Contactabilidad</th>
                                <th className="text-uppercase text-white text-center py-3" style={{ fontSize: '1rem', fontWeight: '700', letterSpacing: '0.5px' }}>Cantidad <br /> Ventas</th>
                                <th className="text-uppercase text-white text-start py-3" style={{ fontSize: '1rem', fontWeight: '700', letterSpacing: '0.5px', width: '200px' }}>Tasa <br /> Conversión</th>
                                <th className="text-uppercase text-white text-start py-3" style={{ fontSize: '1rem', fontWeight: '700', letterSpacing: '0.5px' }}>Ticket <br /> Promedio</th>
                                <th className="text-uppercase text-white text-start py-3 pe-4" style={{ fontSize: '1rem', fontWeight: '700', letterSpacing: '0.5px' }}>ROI <br /> Inversión</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? filteredData.map((row, idx) => {
                                const isDigital = row.origen === 'Meta' || row.origen === 'TikTok';
                                const roiStats = getRoiStatus(row.roi);

                                return (
                                    <tr key={idx}>
                                        {/* COLUMNA: ORIGEN */}
                                        <td className="ps-4 py-3">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="d-flex align-items-center justify-content-center rounded"
                                                    style={{ width: '36px', height: '36px', backgroundColor: '#f1f5f9', border: `1px solid ${getPlatformColor(row.origen)}` }}>
                                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: getPlatformColor(row.origen) }}></div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>{row.origen}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Canal de Captación</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* COLUMNA: LEADS */}
                                        <td className="text-center py-3">
                                            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>{row.leads}</div>
                                            {isDigital && <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Prospectos</div>}
                                        </td>

                                        {/* COLUMNA: CONTACTABILIDAD */}
                                        <td className="text-center py-3">
                                            <Badge bg="light" text="dark" className="border px-2 py-1" style={{ fontSize: '0.85rem' }}>
                                                <i className="bi bi-telephone-outbound me-2 text-primary"></i>
                                                {(row.contactability * 100).toFixed(1)}%
                                            </Badge>
                                        </td>

                                        {/* COLUMNA: VENTAS (CIERRES) */}
                                        <td className="text-center py-3">
                                            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#059669' }}>{row.ventas}</div>
                                        </td>

                                        {/* COLUMNA: CONVERSIÓN CON BARRA DE PROGRESO */}
                                        <td className="py-3">
                                            <div className="d-flex justify-content-between align-items-end mb-1">
                                                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>{row.conversionRate.toFixed(1)}%</span>
                                                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Meta: 4.0%</span>
                                            </div>
                                            <ProgressBar
                                                now={Math.min(row.conversionRate, 100)}
                                                variant={row.conversionRate >= 10 ? 'success' : row.conversionRate >= 4 ? 'warning' : 'danger'}
                                                style={{ height: '6px', backgroundColor: '#e2e8f0' }}
                                            />
                                        </td>

                                        {/* COLUMNA: TICKET PROMEDIO */}
                                        <td className="text-end py-3 text-dark" style={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: '600' }}>
                                            S/ {row.avgTicket.toFixed(2)}
                                        </td>

                                        {/* COLUMNA: ROI E INVERSIÓN */}
                                        <td className="text-end py-3 pe-4">
                                            {isDigital && row.inversion > 0 ? (
                                                <div className="d-flex flex-column align-items-end">
                                                    <span style={{
                                                        backgroundColor: roiStats.bg, color: roiStats.color,
                                                        padding: '4px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '700'
                                                    }}>
                                                        ROI: {row.roi.toFixed(1)}X
                                                    </span>
                                                    <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', fontWeight: '600' }}>
                                                        Inv: S/ {row.inversion.toFixed(0)}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-muted fst-italic" style={{ fontSize: '0.85rem' }}>
                                                    {row.revenue > 0 ? 'Venta Orgánica' : '-'}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-5">
                                        <div className="text-muted">
                                            <i className="bi bi-inbox fs-1 mb-3 d-block text-secondary"></i>
                                            <h6 className="fw-normal">No hay datos suficientes para el periodo seleccionado</h6>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </Card.Body>
        </Card>
    );
};