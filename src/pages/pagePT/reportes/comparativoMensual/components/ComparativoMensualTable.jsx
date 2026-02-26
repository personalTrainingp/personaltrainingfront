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
    showFortnightly = false,
    customStartDay = 1,
    customEndDay = 1
}) => {
    const [viewMode, setViewMode] = useState('none');

    // Nota: Asegúrate de que tu hook useComparativoMensualLogic tenga el bucle en 13
    const { monthsData, top3Indices, top3Averages, last6Averages } = useComparativoMensualLogic({
        ventas,
        year,
        startMonth,
        cutDay,
        customStartDay,
        customEndDay
    });

    const styles = {
        tableWrapper: { overflowX: 'auto', borderRadius: '8px', border: '1px solid #eaeaea', marginTop: '10px' },
        table: { width: '100%', borderCollapse: 'collapse', fontSize: '22px', whiteSpace: 'nowrap' },
        th: { background: '#c00000', color: '#fff', fontWeight: '600', padding: '12px 10px', textAlign: 'center', fontSize: '25px', borderRight: '1px solid rgba(255,255,255,0.2)' },
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
        highlightCell: { background: '#dc3545', color: '#fff', fontWeight: '700' },
        headerActions: { display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }
    };

    const handleToggle = (mode) => setViewMode(viewMode === mode ? 'none' : mode);

    // Calcular filas visibles según el modo activo
    const visibleRows = (() => {
        if (viewMode === 'top3') {
            return [...monthsData].sort((a, b) => b.total - a.total).slice(0, 3);
        }
        if (viewMode === 'last6') {
            return monthsData.slice(-6);
        }
        return monthsData;
    })();

    const renderCell = (row, field, isPct = false) => {
        let style = { ...styles.td };
        if (isPct) style = { ...style, textAlign: 'center', color: '#666' };

        const val = row[field];
        const pctKey = `pct${field.charAt(0).toUpperCase() + field.slice(1)}`;
        const valPct = row[pctKey];

        return (
            <>
                <td style={style}>{fmtNum(val, 0)}</td>
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
                            fontWeight: '800', border: '1px solid #ddd',
                            background: viewMode === 'top3' ? '#fff8b1' : '#fff', color: '#333'
                        }}
                    >
                        🏆 TOP 3
                    </Button>
                    <Button
                        variant={viewMode === 'last6' ? "light" : "light"}
                        onClick={() => handleToggle('last6')}
                        style={{
                            fontWeight: '80 0', border: '1px solid #ddd',
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
                            <th style={{ ...styles.th, width: '90px', position: 'sticky', left: 0, zIndex: 2 }}>MES </th>
                            <th style={{ ...styles.th, background: '#a00000' }}>TOTAL<br /> VENTA<br /><span style={{ fontSize: '16px', color: '#fff' }}>S/</span></th>
                            <th style={{ ...styles.th, background: '#a00000' }}>CUOTA<br /><span style={{ fontSize: '16px', color: '#fff' }}>S/</span></th>

                            {/* CUSTOM RANGE COLUMN */}
                            <th style={{ ...styles.th, background: '#c00000', color: '#fff' }}>
                                RANGO<br />({customStartDay}-{customEndDay})<br /><span style={{ fontSize: '16px', color: '#fff' }}>S/</span>
                            </th>
                            <th style={{ ...styles.th, background: '#c00000', color: '#fff', fontSize: '16px' }}>
                                PORCENTAJE  <br />ALCANCE DE  <br /> <span>CUOTA</span>
                            </th>

                            <th style={styles.th} colSpan={2}>SEMANA 1<br /> (1-7)<br /><span style={{ fontSize: '16px', color: '#fff' }}>S/</span></th>
                            <th style={styles.th} colSpan={2}>SEMANA 2<br /> (8-14)<br /><span style={{ fontSize: '16px', color: '#fff' }}>S/</span></th>
                            <th style={styles.th} colSpan={2}>SEMANA 3<br /> (15-21)<br /><span style={{ fontSize: '16px', color: '#fff' }}>S/</span></th>
                            <th style={styles.th} colSpan={2}>SEMANA 4<br /> (22-28)<br /><span style={{ fontSize: '16px', color: '#fff' }}>S/</span></th>
                            <th style={styles.th} colSpan={2}>SEMANA 5<br /> (29-31)<br /><span style={{ fontSize: '16px', color: '#fff' }}>S/</span></th>
                            {showFortnightly && (
                                <>
                                    <th style={{ ...styles.th, background: '#222' }} colSpan={2}>DIA 1 AL 15</th>
                                    <th style={{ ...styles.th, background: '#222' }} colSpan={2}>DIA 16 A FIN</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {visibleRows.map((row, idx) => (
                            <tr key={row.key} style={{ background: idx % 2 === 0 ? '#fff' : '#fcfcfc' }}>

                                {/* --- CAMBIO AQUÍ PARA SALTO DE LÍNEA --- */}
                                <td style={{ ...styles.td, ...styles.tdLabel }}>
                                    <span style={{ display: 'block', lineHeight: '1.2' }}>{row.label}</span>
                                </td>
                                {/* --------------------------------------- */}

                                <td style={{ ...styles.td, fontWeight: '700', color: '#000', background: 'rgba(0,0,0,0.02)' }}>{fmtNum(row.total, 0)}</td>
                                <td style={{ ...styles.td, color: '#555' }}>{fmtNum(row.quota, 0)}</td>

                                {/* Custom Range Data */}
                                <td style={{ ...styles.td, background: '#c00000', color: '#fff', fontWeight: '400' }}>
                                    {fmtNum(row.customRangeTotal, 0)}
                                </td>
                                <td style={{ ...styles.td, background: '#c00000', textAlign: 'center', color: '#fff', fontWeight: '400' }}>
                                    {fmtNum(row.pctCustomRangeTotal, 1)}%
                                </td>

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
                    </tbody>
                </table>
            </div>
        </div>
    );
};