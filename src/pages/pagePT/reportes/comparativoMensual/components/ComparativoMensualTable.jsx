import React, { useState } from 'react';
import { fmtMoney, fmtNum } from '../../resumenEjecutivo/adapters/executibleLogic';
import { useComparativoMensualLogic } from '../hooks/useComparativoMensualLogic';
import { Button, ButtonGroup } from 'react-bootstrap';

export const ComparativoMensualTable = ({
    ventas = [],
    year,
    startMonth = 0,
    cutDay = 21,
    title = "",
    showFortnightly = false
}) => {
    const [viewMode, setViewMode] = useState('none');

    // Nota: Asegúrate de que tu hook useComparativoMensualLogic tenga el bucle en 13
    const { monthsData, top3Indices, top3Averages, last6Averages } = useComparativoMensualLogic({
        ventas,
        year,
        startMonth,
        cutDay
    });

    const styles = {
        tableWrapper: { overflowX: 'auto', borderRadius: '8px', border: '1px solid #eaeaea', marginTop: '10px' },
        table: { width: '100%', borderCollapse: 'collapse', fontSize: '20px', whiteSpace: 'nowrap' },
        th: { background: '#c00000', color: '#fff', fontWeight: '600', padding: '12px 10px', textAlign: 'center', fontSize: '24px', borderRight: '1px solid rgba(255,255,255,0.2)' },
        td: { padding: '10px 12px', borderBottom: '1px solid #eee', textAlign: 'right', color: '#444' },

        // MODIFICADO: Ajustamos tdLabel para asegurar alineación vertical
        tdLabel: {
            textAlign: 'left',
            fontWeight: '600',
            color: '#222',
            textTransform: 'capitalize',
            position: 'sticky',
            left: 0,
            background: '#fff',
            zIndex: 1,
            borderRight: '2px solid #f0f0f0',
            verticalAlign: 'middle' // Para centrar verticalmente si la altura cambia
        },
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
        const pctKey = `pct${field.charAt(0).toUpperCase() + field.slice(1)}`;
        const valPct = row[pctKey];

        return (
            <>
                <td style={style}>{fmtMoney(val)}</td>
                <td style={{ ...style, textAlign: 'center' }}>{isPct ? `${fmtNum(valPct, 1)}%` : ''}</td>
            </>
        );
    };

    return (
        <div style={{ marginBottom: '40px' }}>
            {title && (
                <h3 style={{
                    background: '#000',
                    color: '#fff',
                    padding: '10px 20px',
                    fontSize: '19px',
                    fontWeight: 'bold',
                    marginBottom: '10px',
                    borderRadius: '4px',
                    display: 'inline-block',
                    textTransform: 'uppercase'
                }}>
                    {title}
                </h3>
            )}

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
                            <th style={{ ...styles.th, width: '90px', position: 'sticky', left: 0, zIndex: 2 }}>MES <br /> AÑO</th>
                            <th style={{ ...styles.th, background: '#a00000' }}>TOTAL<br /> VENTA</th>
                            <th style={{ ...styles.th, background: '#a00000' }}>CUOTA</th>
                            <th style={styles.th} colSpan={2}>SEMANA 1<br /> (1-7)</th>
                            <th style={styles.th} colSpan={2}>SEMANA 2<br /> (8-14)</th>
                            <th style={styles.th} colSpan={2}>SEMANA 3<br /> (15-21)</th>
                            <th style={styles.th} colSpan={2}>SEMANA 4<br /> (22-28)</th>
                            <th style={styles.th} colSpan={2}>SEMANA 5<br /> (29-31)</th>
                            {showFortnightly && (
                                <>
                                    <th style={{ ...styles.th, background: '#222' }} colSpan={2}>DIA 1 AL 15</th>
                                    <th style={{ ...styles.th, background: '#222' }} colSpan={2}>DIA 16 A FIN</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {monthsData.map((row, idx) => (
                            <tr key={row.key} style={{ background: idx % 2 === 0 ? '#fff' : '#fcfcfc' }}>

                                {/* --- CAMBIO AQUÍ PARA SALTO DE LÍNEA --- */}
                                <td style={{ ...styles.td, ...styles.tdLabel }}>
                                    <span style={{ display: 'block', lineHeight: '1.2' }}>{row.label}</span>
                                    <span style={{
                                        display: 'block',
                                        fontSize: '13px',
                                        color: '#888',
                                        fontWeight: 'normal',
                                        marginTop: '4px'
                                    }}>
                                        {row.year}
                                    </span>
                                </td>
                                {/* --------------------------------------- */}

                                <td style={{ ...styles.td, fontWeight: '700', color: '#000', background: 'rgba(0,0,0,0.02)' }}>{fmtMoney(row.total)}</td>
                                <td style={{ ...styles.td, color: '#555' }}>{fmtMoney(row.quota)}</td>
                                {renderCell(row, 'w1', true)}
                                {renderCell(row, 'w2', true)}
                                {renderCell(row, 'w3', true)}
                                {renderCell(row, 'w4', true)}
                                {renderCell(row, 'w5', true)}

                                {showFortnightly && (
                                    <>
                                        {renderCell(row, 'r1_15', true)}
                                        {renderCell(row, 'r16_end', true)}
                                    </>
                                )}
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

                                    {showFortnightly && (
                                        <>
                                            <td style={{ ...styles.td, fontWeight: '600' }}>{fmtMoney(data.r1_15)}</td>
                                            <td style={{ ...styles.td, textAlign: 'center' }}>-</td>
                                            <td style={{ ...styles.td, fontWeight: '600' }}>{fmtMoney(data.r16_end)}</td>
                                            <td style={{ ...styles.td, textAlign: 'center' }}>-</td>
                                        </>
                                    )}
                                </tr>
                            );
                        })()}
                    </tbody>
                </table>
            </div>
        </div>
    );
};