import React from 'react';
import { Card, Table, ProgressBar, Badge } from 'react-bootstrap';
import { useConversionEfficiency } from '../hooks/useConversionEfficiency';

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
            'TikTok': '#00f2fe',
            'Instagram': '#E1306C',
            'Facebook': '#1877F2',
            'Referidos': '#10b981',
            'Renovaciones': '#f59e0b'
        };
        return originMap[origen] || '#6b7280';
    };

    const getRoiStatus = (roi) => {
        if (roi >= 3) return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', text: 'Excelente' };
        if (roi >= 1) return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', text: 'Regular' };
        return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', text: 'Pérdida' };
    };

    return (
        <Card className="shadow-lg border-0 mb-4" style={{ backgroundColor: "#000000", borderRadius: "16px", overflow: "hidden" }}>

            {/* HEADER */}
            <Card.Header className="pt-4 pb-3 border-0" style={{ backgroundColor: "rgba(255, 255, 255, 0.02)" }}>
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h4 className="m-0 text-white d-flex align-items-center gap-2 text-center" style={{ fontSize: "1.1rem", fontWeight: "700" }}>
                            <i className="bi bi-funnel-fill text-primary "></i>
                            Eficiencia de Conversión y Embudo
                        </h4>
                        <p className="text-secondary mb-0 mt-1" style={{ fontSize: "0.85rem" }}>
                            Rendimiento detallado por origen y plataformas publicitarias
                        </p>
                    </div>
                    <div>
                        <Badge bg="dark" text="light" className="px-3 py-2 border border-secondary rounded-pill">
                            <i className="bi bi-calendar3 me-2"></i>
                            {`${initDay || 1} al ${cutDay || 31} de ${selectedMonth} / ${year}`}
                        </Badge>
                    </div>
                </div>
            </Card.Header>

            {/* BODY / TABLE */}
            <Card.Body className="p-0">
                <div className="table-responsive">
                    <Table hover variant="dark" className="m-0 align-middle text-nowrap" style={{ '--bs-table-bg': 'transparent', '--bs-table-hover-bg': 'rgba(255,255,255,0.03)', width: "100%" }}>
                        <thead style={{ backgroundColor: "#c00000", borderBottom: "2px solid #334155" }}>
                            <tr>
                                <th className="text-uppercase text-white-3 ps-4" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', backgroundColor: "#c00000" }}>Origen / Red</th>
                                <th className="text-uppercase text-white-3 text-center py-3" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', backgroundColor: "#c00000" }}>Leads / Tráfico</th>
                                <th className="text-uppercase text-white-3 text-center py-3" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', backgroundColor: "#c00000" }}>Contactabilidad</th>
                                <th className="text-uppercase text-white-3 text-center py-3" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', backgroundColor: "#c00000" }}>Cierres (Ventas)</th>
                                <th className="text-uppercase text-white-3 text-start py-3" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', width: '200px', backgroundColor: "#c00000" }}>Tasa Conversión</th>
                                <th className="text-uppercase text-white-3 text-end py-3" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', backgroundColor: "#c00000" }}>Ticket Promedio</th>
                                <th className="text-uppercase text-white-3 text-end py-3 pe-4" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', backgroundColor: "#c00000" }}>ROI / Inversión</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? filteredData.map((row, idx) => {
                                const isDigital = row.origen === 'Meta' || row.origen === 'TikTok';
                                const roiStats = getRoiStatus(row.roi);

                                return (
                                    <tr key={idx} style={{ borderBottom: "1px solid #1e293b" }}>
                                        {/* COLUMNA: ORIGEN */}
                                        <td className="ps-4 py-3">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="d-flex align-items-center justify-content-center rounded"
                                                    style={{ width: '36px', height: '36px', backgroundColor: 'rgba(255,255,255,0.05)', border: `1px solid ${getPlatformColor(row.origen)}` }}>
                                                    {/* Usa un icono de Bootstrap si lo prefieres. Aquí un bullet de color por defecto */}
                                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: getPlatformColor(row.origen) }}></div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#f8fafc' }}>{row.origen}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Canal de Captación</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* COLUMNA: LEADS */}
                                        <td className="text-center py-3">
                                            <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#f8fafc' }}>{row.leads}</div>
                                            {isDigital && <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Prospectos</div>}
                                        </td>

                                        {/* COLUMNA: CONTACTABILIDAD */}
                                        <td className="text-center py-3">
                                            <Badge bg="dark" border="light" className="text-light fw-normal p-2" style={{ border: '1px solid #334155', fontSize: '1rem' }}>
                                                <i className="bi bi-telephone-outbound me-2 text-info"></i>
                                                {(row.contactability * 100).toFixed(1)}%
                                            </Badge>
                                        </td>

                                        {/* COLUMNA: VENTAS (CIERRES) */}
                                        <td className="text-center py-3">
                                            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#10b981' }}>{row.ventas}</div>
                                        </td>

                                        {/* COLUMNA: CONVERSIÓN CON BARRA DE PROGRESO */}
                                        <td className="py-3">
                                            <div className="d-flex justify-content-between align-items-end mb-1">
                                                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#f8fafc' }}>{row.conversionRate.toFixed(1)}%</span>
                                                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Meta: 4.0%</span>
                                            </div>
                                            <ProgressBar
                                                now={Math.min(row.conversionRate, 100)}
                                                variant={row.conversionRate >= 10 ? 'success' : row.conversionRate >= 4 ? 'warning' : 'danger'}
                                                style={{ height: '6px', backgroundColor: '#1e293b' }}
                                            />
                                        </td>

                                        {/* COLUMNA: TICKET PROMEDIO */}
                                        <td className="text-end py-3 text-light" style={{ fontFamily: 'monospace', fontSize: '1rem' }}>
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
                                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
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
                                            <i className="bi bi-inbox fs-1 mb-3 d-block"></i>
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