import React, { useState } from 'react';
import { fmtMoney, fmtNum } from '../resumenEjecutivo/adapters/executibleLogic';
import { useComparativoMensualLogic } from './useComparativoMensualLogic';
import { Button, ButtonGroup } from 'react-bootstrap';

export const ComparativoMensualTable = ({
    ventas = [],
    year,
    startMonth = 0, // AHORA RECIBE EL MES COMO PROP
    cutDay = 21
}) => {
    // Ya no usamos useState para el mes aquí adentro.
    const [viewMode, setViewMode] = useState('none');

    // Pasamos el startMonth que viene de props al hook
    const { monthsData, top3Indices, top3Averages, last6Averages } = useComparativoMensualLogic({
        ventas,
        year,
        startMonth,
        cutDay
    });

    const styles = {
        // ... (Mismos estilos de antes, quitando el marginTop extra si lo deseas)
        tableWrapper: { overflowX: 'auto', borderRadius: '8px', border: '1px solid #eaeaea', marginTop: '10px' },
        table: { width: '100%', borderCollapse: 'collapse', fontSize: '18px', whiteSpace: 'nowrap' },
        th: { background: '#c00000', color: '#fff', fontWeight: '600', padding: '12px 10px', textAlign: 'center', fontSize: '18px', borderRight: '1px solid rgba(255,255,255,0.2)' },
        td: { padding: '10px 12px', borderBottom: '1px solid #eee', textAlign: 'right', color: '#444' },
        tdLabel: { textAlign: 'left', fontWeight: '600', color: '#222', textTransform: 'capitalize', position: 'sticky', left: 0, background: '#fff', zIndex: 1, borderRight: '2px solid #f0f0f0' },
        footerRow: { background: '#f8f9fa', borderTop: '2px solid #dee2e6' },
        highlightCell: { background: '#f7e312ff', color: '#c00000', fontWeight: '700' },
        headerActions: { display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }
    };

    const handleToggle = (mode) => setViewMode(viewMode === mode ? 'none' : mode);
    const isTop3 = (key, field) => viewMode === 'top3' && top3Indices[field]?.includes(key);

    const renderCell = (row, field, isPct = false) => {
        const isHighlighted = isTop3(row.key, field);
        let style = { ...styles.td };
        if (isHighlighted) style = { ...style, ...styles.highlightCell };
        if (isPct) style = { ...style, textAlign: 'center', color: '#666', fontSize: '18px' };

        const val = row[field];
        const valPct = row[`pct${field.charAt(0).toUpperCase() + field.slice(1)}`];

        return (
            <>
                <td style={style}>{fmtMoney(val)}</td>
                <td style={{ ...style, textAlign: 'center' }}>{isPct ? `${fmtNum(valPct, 1)}%` : ''}</td>
            </>
        );
    };

    return (
        <div>
            {/* Solo dejamos los botones de filtro aquí, los selectores están arriba en la Page */}
            <div style={styles.headerActions}>
                <ButtonGroup style={{ boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    <Button
                        variant={viewMode === 'top3' ? "light" : "light"}
                        onClick={() => handleToggle('top3')}
                        style={{
                            fontWeight: '600', border: '1px solid #ddd', fontSize: '18px',
                            background: viewMode === 'top3' ? '#fff8b1' : '#fff', color: '#333'
                        }}
                    >
                        🏆 TOP 3
                    </Button>
                    <Button
                        variant={viewMode === 'last6' ? "light" : "light"}
                        onClick={() => handleToggle('last6')}
                        style={{
                            fontWeight: '600', border: '1px solid #ddd', fontSize: '18px',
                            background: viewMode === 'last6' ? '#e2e3e5' : '#fff', color: '#333'
                        }}
                    >
                        📅 ÚLTIMOS 6 MESES
                    </Button>
                </ButtonGroup>
            </div>

            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ ...styles.th, width: '140px', position: 'sticky', left: 0, zIndex: 2 }}>MES / AÑO</th>
                            <th style={{ ...styles.th, background: '#a00000' }}>TOTAL VENTA</th>
                            <th style={{ ...styles.th, background: '#a00000' }}>CUOTA</th>
                            <th style={styles.th} colSpan={2}>SEM 1 (1-7)</th>
                            <th style={styles.th} colSpan={2}>SEM 2 (8-14)</th>
                            <th style={styles.th} colSpan={2}>SEM 3 (15-21)</th>
                            <th style={styles.th} colSpan={2}>SEM 4 (22-28)</th>
                            <th style={styles.th} colSpan={2}>SEM 5 (29-31)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {monthsData.map((row, idx) => (
                            <tr key={row.key} style={{ background: idx % 2 === 0 ? '#fff' : '#fcfcfc' }}>
                                <td style={{ ...styles.td, ...styles.tdLabel }}>
                                    {row.label} <span style={{ fontSize: '11px', color: '#fff', fontWeight: 'normal' }}>{row.year}</span>
                                </td>
                                <td style={{ ...styles.td, fontWeight: '700', color: '#000', background: 'rgba(0,0,0,0.02)' }}>{fmtMoney(row.total)}</td>
                                <td style={{ ...styles.td, color: '#555' }}>{fmtMoney(row.quota)}</td>
                                {renderCell(row, 'w1', true)}
                                {renderCell(row, 'w2', true)}
                                {renderCell(row, 'w3', true)}
                                {renderCell(row, 'w4', true)}
                                {renderCell(row, 'w5', true)}
                            </tr>
                        ))}
                        {viewMode !== 'none' && (() => {
                            const data = viewMode === 'top3' ? top3Averages : last6Averages;
                            const label = viewMode === 'top3' ? "PROMEDIO (TOP 3)" : "PROMEDIO (ÚLT. 6 MESES)";
                            return (
                                <tr style={styles.footerRow}>
                                    <td style={{ ...styles.td, ...styles.tdLabel, background: '#f8f9fa', color: '#c00000' }}>{label}</td>
                                    <td style={{ ...styles.td, fontWeight: '800', color: '#c00000' }}>{fmtMoney(data.total)}</td>
                                    <td style={{ ...styles.td, textAlign: 'center', fontWeight: 'bold' }}>-</td>
                                    <td style={{ ...styles.td, fontWeight: '600' }}>{fmtMoney(data.w1)}</td>
                                    <td style={{ ...styles.td, textAlign: 'center' }}>-</td>
                                    <td style={{ ...styles.td, fontWeight: '600' }}>{fmtMoney(data.w2)}</td>
                                    <td style={{ ...styles.td, textAlign: 'center' }}>-</td>
                                    <td style={{ ...styles.td, fontWeight: '600' }}>{fmtMoney(data.w3)}</td>
                                    <td style={{ ...styles.td, textAlign: 'center' }}>-</td>
                                    <td style={{ ...styles.td, fontWeight: '600' }}>{fmtMoney(data.w4)}</td>
                                    <td style={{ ...styles.td, textAlign: 'center' }}>-</td>
                                    <td style={{ ...styles.td, fontWeight: '600' }}>{fmtMoney(data.w5)}</td>
                                    <td style={{ ...styles.td, textAlign: 'center' }}>-</td>
                                </tr>
                            );
                        })()}
                    </tbody>
                </table>
            </div>
        </div>
    );
};