import React, { useState } from 'react';

/**
 * Nota: Para que los iconos funcionen, asegúrate de incluir:
 * <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
 */

export const OverlappingMembershipsTable = ({ ventas = [] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const overlaps = Array.isArray(ventas) ? ventas : [];

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const [y, m, d] = dateStr.split(' ')[0].split('-');
        return `${d}/${m}/${y}`;
    };

    const styles = {
        wrapper: {
            marginTop: '2rem',
            border: "1px solid #dee2e6",
            borderRadius: "12px",
            overflow: "hidden",
            background: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            fontFamily: "'Segoe UI', Roboto, sans-serif"
        },
        header: {
            background: isOpen ? "#0d6efd" : "#f8f9fa", // Azul primario si está abierto
            color: isOpen ? "#fff" : "#212529",
            padding: "1rem 1.5rem",
            fontWeight: "700",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
        },
        table: { width: "100%", borderCollapse: "collapse" },
        th: {
            padding: "1rem",
            background: "#f1f3f5",
            fontSize: "1.3rem",
            fontWeight: "800",
            color: "#495057",
            textTransform: "uppercase",
            borderBottom: "2px solid #dee2e6"
        },
        td: {
            padding: "1rem",
            borderBottom: "1px solid #f1f3f5",
            fontSize: "1.2rem",
            verticalAlign: "top"
        },
        card: {
            padding: "10px",
            borderRadius: "8px",
            background: "#f8f9fa",
            border: "1px solid #e9ecef",
            fontSize: "1.2rem"
        },
        badge: {
            padding: "3px 8px",
            borderRadius: "4px",
            fontSize: "1.2rem",
            fontWeight: "700",
            background: "#e7f1ff",
            color: "#0d6efd",
            display: "inline-block",
            marginBottom: "5px"
        },
        conflict: {
            color: "#dc3545",
            fontWeight: "700",
            background: "#fff5f5",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ffe3e3",
            textAlign: "center"
        }
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.header} onClick={() => setIsOpen(!isOpen)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className={`bi ${isOpen ? 'bi-folder2-open' : 'bi-folder-symlink-fill'}`}></i>
                    <span>SOCIOS CON MEMBRESÍAS EN CONFLICTO ({overlaps.length})</span>
                </div>
                <i className={`bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`} style={{ fontSize: '1.2rem' }}></i>
            </div>

            {isOpen && (
                <div style={{ overflowX: 'auto' }}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}><i className="bi bi-person-circle me-2"></i>Socio</th>
                                <th style={styles.th}><i className="bi bi-person-badge me-2"></i>Asesor</th>
                                <th style={styles.th}><i className="bi bi-card-list me-2"></i>Contrato Original (A)</th>
                                <th style={styles.th}><i className="bi bi-arrow-left-right me-2"></i>Nuevo / Cruce (B)</th>
                                <th style={styles.th}><i className="bi bi-exclamation-octagon me-2"></i>Conflicto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {overlaps.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ ...styles.td, textAlign: 'center', padding: '3rem', color: '#adb5bd' }}>
                                        <i className="bi bi-check-circle-fill d-block mb-2" style={{ fontSize: '2rem', color: '#198754' }}></i>
                                        No se detectaron cruces de membresías en este periodo.
                                    </td>
                                </tr>
                            ) : (
                                overlaps.map((row, idx) => (
                                    <tr key={`${row.cliente_id}-${idx}`}>
                                        <td style={styles.td}>
                                            <div style={{ fontWeight: '700', color: '#212529' }}>{row.nombre_cliente}</div>
                                            <small className="text-muted">ID: {row.cliente_id}</small>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                {row.asesor_A === row.asesor_B ? (
                                                    <span><i className="bi bi-person-check me-1"></i> {row.asesor_A}</span>
                                                ) : (
                                                    <>
                                                        <small>A: {row.asesor_A}</small>
                                                        <small>B: {row.asesor_B}</small>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={styles.card}>
                                                <span style={styles.badge}>{row.plan_A || "Membresía"}</span>
                                                <div className="mb-1">
                                                    <i className="bi bi-calendar3 me-2 text-primary"></i>
                                                    {formatDate(row.inicio_A)} - {formatDate(row.fin_A)}
                                                </div>
                                                <div className="text-muted" style={{ fontSize: '1rem' }}>Ticket: {row.venta_A}</div>
                                                {row.observacion_A && (
                                                    <div style={{ marginTop: '5px', fontSize: '1rem', fontStyle: 'italic' }}>
                                                        <i className="bi bi-info-circle me-1"></i> {row.observacion_A}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={styles.card}>
                                                <span style={styles.badge}>{row.plan_B || "Membresía"}</span>
                                                <div className="mb-1">
                                                    <i className="bi bi-calendar3 me-2 text-primary"></i>
                                                    {formatDate(row.inicio_B)} - {formatDate(row.fin_B)}
                                                </div>
                                                <div className="text-muted" style={{ fontSize: '1rem' }}>Ticket: {row.venta_B}</div>
                                                {row.observacion_B && (
                                                    <div style={{ marginTop: '5px', fontSize: '1rem', fontStyle: 'italic' }}>
                                                        <i className="bi bi-info-circle me-1"></i> {row.observacion_B}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={styles.conflict}>
                                                <i className="bi bi-exclamation-triangle-fill d-block mb-1"></i>
                                                {row.dias_solapados} Días
                                            </div>
                                        </td>
                                    </tr>
                                )))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};