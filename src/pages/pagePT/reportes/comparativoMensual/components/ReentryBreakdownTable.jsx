import React from 'react';
import { useReentryBreakdown } from '../hooks/useReentryBreakdown';
import { fmtMoney } from '../../resumenEjecutivo/adapters/executibleLogic';

export const ReentryBreakdownTable = ({ ventas = [], monthsData = [] }) => {

    const { repData, totals, grandTotal } = useReentryBreakdown(ventas, monthsData);

    // --- ESTILOS (Copiados de GeneralSalesBreakdownTable) ---
    const styles = {
        card: {
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            padding: '20px',
            marginTop: '30px',
            fontFamily: "'Inter', 'Segoe UI', sans-serif"
        },
        headerTitle: {
            fontSize: '25px',
            fontWeight: '800',
            color: '#1a1a1a',
            marginBottom: '15px',
            borderLeft: '5px solid #fff',
            paddingLeft: '15px',
            textTransform: 'uppercase'
        },
        tableWrapper: {
            overflowX: 'auto',
            borderRadius: '8px',
            border: '1px solid #fff'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '20px',
            whiteSpace: 'nowrap'
        },
        // Encabezados
        thGroup: {
            background: '#c00000',
            color: '#fff',
            padding: '10px 15px',
            textAlign: 'center',
            borderBottom: '1px solid #eee',
            borderleft: '1px solid #eee',
            fontWeight: '600',
            borderRight: '1px solid rgba(255,255,255,0.2)'
        },
        thSub: {
            background: '#c00000',
            color: '#fff',
            padding: '8px',
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: '700',
            borderBottom: '2px solid #ddd',
            borderRight: '1px solid #eee'
        },
        // Sticky Columns
        thStickyLeft: {
            position: 'sticky',
            left: 0,
            zIndex: 4, // Aumentamos zIndex para que tape al hacer scroll
            background: '#c00000',
            color: '#fff',
            padding: '12px',
            textAlign: 'left',
            fontWeight: '800',
            borderBottom: '2px solid #ddd',
            borderRight: '2px solid #ddd',
            minWidth: '200px',
            verticalAlign: 'middle' // Centrado verticalmente al unir filas
        },
        tdStickyLeft: {
            position: 'sticky',
            left: 0,
            zIndex: 2,
            background: '#fff',
            borderRight: '2px solid #f0f0f0',
            borderBottom: '1px solid #f0f0f0',
            padding: '10px 12px',
            fontWeight: '600',
            color: '#333'
        },
        td: {
            padding: '10px 12px',
            borderBottom: '1px solid #f0f0f0',
            textAlign: 'right',
            color: '#444',
            borderRight: '1px solid #fafafa'
        },
        // Columnas de Total (Vertical)
        tdTotalRow: {
            background: '#fffdf0',
            fontWeight: '700',
            color: '#333',
            textAlign: 'right',
            padding: '10px 12px',
            borderBottom: '1px solid #f0f0f0'
        },
        // Footer (Total General)
        grandTotalRow: {
            background: '#d9d9d9',
            color: '#000',
            fontWeight: 'bold',
        },
        tdGrandTotalLabel: {
            padding: '12px',
            textAlign: 'center',
            color: '#000',
            fontWeight: '800',
            background: '#d9d9d9',
            position: 'sticky',
            left: 0,
            zIndex: 2,
            borderTop: '2px solid #999'
        },
        tdGrandTotalValue: {
            padding: '12px',
            textAlign: 'right',
            color: '#000',
            borderTop: '2px solid #999',
            borderRight: '1px solid #ccc'
        }
    };

    if (!monthsData || monthsData.length === 0) return null;

    return (
        <div style={styles.card}>
            <h5 style={styles.headerTitle}> Reinscripciones por Asesor</h5>

            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead>
                        {/* 1. FILA SUPERIOR */}
                        <tr>
                            <th style={styles.thStickyLeft} rowSpan={2}>
                                ASESOR
                            </th>
                            {monthsData.map(m => (
                                <th key={m.key} colSpan={2} style={styles.thGroup}>
                                    {m.label.toUpperCase()}
                                </th>
                            ))}
                            <th colSpan={2} style={{ ...styles.thGroup, background: '#333' }}>
                                TOTAL ACUMULADO
                            </th>
                        </tr>

                        {/* 2. FILA INFERIOR */}
                        <tr>
                            {monthsData.map(m => (
                                <React.Fragment key={m.key}>
                                    <th style={styles.thSub}>CANTIDAD</th>
                                    <th style={styles.thSub}>IMPORTE</th>
                                </React.Fragment>
                            ))}

                            <th style={{ ...styles.thSub, background: '#e9ecef', color: '#000' }}>CANTIDAD</th>
                            <th style={{ ...styles.thSub, background: '#e9ecef', color: '#000' }}>IMPORTE</th>
                        </tr>
                    </thead>

                    <tbody>
                        {repData.map(([repName, monthMap], idx) => {
                            // Calcular totales horizontales
                            let rowCount = 0;
                            let rowAmount = 0;

                            const cells = monthsData.map(m => {
                                const data = monthMap.get(m.key);
                                if (data) {
                                    rowCount += data.count;
                                    rowAmount += data.amount;
                                }
                                return data;
                            });

                            return (
                                <tr key={repName} style={{ background: idx % 2 === 0 ? '#fff' : '#fcfcfc' }}>
                                    <td style={styles.tdStickyLeft}>{repName}</td>
                                    {cells.map((data, i) => (
                                        <React.Fragment key={i}>
                                            <td style={styles.td}>
                                                {data && data.count > 0 ? data.count : '-'}
                                            </td>
                                            <td style={styles.td}>
                                                {data && data.amount > 0 ? fmtMoney(data.amount) : '-'}
                                            </td>
                                        </React.Fragment>
                                    ))}
                                    <td style={{ ...styles.tdTotalRow }}>
                                        {rowCount > 0 ? rowCount : '-'}
                                    </td>
                                    <td style={{ ...styles.tdTotalRow, color: rowAmount > 0 ? '#c00000' : '#333' }}>
                                        {rowAmount > 0 ? fmtMoney(rowAmount) : '-'}
                                    </td>
                                </tr>
                            );
                        })}

                        {/* --- FILA DE TOTALES GENERALES --- */}
                        <tr style={styles.grandTotalRow}>
                            <td style={styles.tdGrandTotalLabel}>
                                TOTAL
                            </td>

                            {monthsData.map(m => {
                                const total = totals[m.key];
                                return (
                                    <React.Fragment key={m.key}>
                                        <td style={styles.tdGrandTotalValue}>
                                            {total && total.count > 0 ? total.count : '-'}
                                        </td>
                                        <td style={styles.tdGrandTotalValue}>
                                            {total && total.amount > 0 ? fmtMoney(total.amount) : '-'}
                                        </td>
                                    </React.Fragment>
                                );
                            })}

                            <td style={{ ...styles.tdGrandTotalValue, background: '#ccc' }}>
                                {grandTotal?.count > 0 ? grandTotal.count : '-'}
                            </td>
                            <td style={{ ...styles.tdGrandTotalValue, background: '#ccc', color: '#000' }}>
                                {grandTotal?.amount > 0 ? fmtMoney(grandTotal.amount) : '-'}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
