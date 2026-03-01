import React from 'react';
import { useRenovationsBreakdown } from '../hooks/useRenovationsBreakdown';
import { fmtMoney } from '../../resumenEjecutivo/adapters/executibleLogic';

export const RenovationsBreakdownTable = ({ ventas = [], monthsData = [] }) => {

    const { repData, totals, grandTotal } = useRenovationsBreakdown(ventas, monthsData);

    // --- ESTILOS (Copiados de ReentryBreakdownTable) ---
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
            paddingLeft: '15px',
            textTransform: 'uppercase'
        },
        tableWrapper: {
            overflowX: 'auto',
            borderRadius: '8px',
            border: '3px solid #000'
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
            borderBottom: '1px solid #000',
            borderleft: '1px solid #000',
            fontWeight: '600',
            borderRight: '1px solid #000'
        },
        thSub: {
            background: '#c00000',
            color: '#fff',
            padding: '8px',
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: '700',
            borderBottom: '1px solid #000',
            borderRight: '1px solid #000'
        },
        // Sticky Columns
        thStickyLeft: {
            position: 'sticky',
            left: 0,
            zIndex: 4,
            background: '#c00000',
            color: '#fff',
            padding: '12px',
            textAlign: 'left',
            fontWeight: '800',
            borderBottom: '2px solid #000',
            borderRight: '2px solid #000',
            minWidth: '200px',
            verticalAlign: 'middle'
        },
        tdStickyLeft: {
            position: 'sticky',
            left: 0,
            zIndex: 2,
            color: '#fff',
            borderRight: '2px solid #000',
            borderBottom: '1px solid #000',
            padding: '10px 12px',
            fontWeight: '600',
        },
        td: {
            padding: '10px 12px',
            borderBottom: '1px solid #000',
            textAlign: 'right',
            borderRight: '1px solid #000'
        },
        // Columnas de Total (Vertical)
        tdTotalRow: {
            background: '#fffdf0',
            fontWeight: '700',
            color: '#333',
            textAlign: 'right',
            padding: '10px 12px',
            borderBottom: '1px solid #000',
            borderRight: '1px solid #000'
        },
        // Footer (Total General)
        grandTotalRow: {
            background: '#c00000',
            color: '#fff',
            fontWeight: 'bold',
            borderBottom: '2px solid #000',
            borderRight: '1px solid #000'
        },
        tdGrandTotalLabel: {
            padding: '12px',
            textAlign: 'center',
            color: '#fff',
            fontWeight: '800',
            background: '#c00000',
            position: 'sticky',
            left: 0,
            zIndex: 2,
            borderTop: '2px solid #000',
            borderBottom: '2px solid #000',
            borderRight: '1px solid #000'
        },
        tdGrandTotalValue: {
            padding: '12px',
            textAlign: 'right',
            color: '#fff',
            borderTop: '2px solid #000',
            borderRight: '1px solid #000',
            borderBottom: '1px solid #000'
        }
    };

    if (monthsData.length === 0) return null;

    return (
        <div style={styles.card}>
            <h5 style={styles.headerTitle}>Renovaciones por Asesor</h5>

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
                            <th colSpan={2} style={styles.thGroup}>
                                TOTAL ACUMULADO
                            </th>
                        </tr>

                        {/* 2. FILA INFERIOR */}
                        <tr>
                            {monthsData.map(m => (
                                <React.Fragment key={m.key + '-sub'}>
                                    <th style={styles.thSub}>SOCIOS</th>
                                    <th style={styles.thSub}>VENTAS</th>
                                </React.Fragment>
                            ))}
                            <th style={styles.thSub}>SOCIOS</th>
                            <th style={styles.thSub}>VENTAS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {repData.map(([repName, monthMap], idx) => {
                            // Calculate row total
                            let rowCount = 0;
                            let rowAmount = 0;
                            monthMap.forEach(val => {
                                rowCount += val.count;
                                rowAmount += val.amount;
                            });

                            return (
                                <tr key={repName} style={{ background: idx % 2 === 0 ? '#fff' : '#fcfcfc' }}>
                                    <td style={{ ...styles.tdStickyLeft, background: '#c00000' }}>{repName}</td>
                                    {monthsData.map(m => {
                                        const data = monthMap.get(m.key) || { count: 0, amount: 0 };
                                        return (
                                            <React.Fragment key={m.key}>
                                                <td style={styles.td}>
                                                    {data.count > 0 ? data.count : '-'}
                                                </td>
                                                <td style={styles.td}>
                                                    {data.amount > 0 ? fmtMoney(data.amount) : '-'}
                                                </td>
                                            </React.Fragment>
                                        );
                                    })}
                                    {/* Row Total Column */}
                                    <td style={styles.tdTotalRow}>{rowCount > 0 ? rowCount : '-'}</td>
                                    <td style={styles.tdTotalRow}>{rowAmount > 0 ? fmtMoney(rowAmount) : '-'}</td>
                                </tr>
                            );
                        })}

                        {/* Fila de Totales */}
                        {repData.length > 0 && (
                            <tr style={styles.grandTotalRow}>
                                <td style={styles.tdGrandTotalLabel}>
                                    TOTAL
                                </td>
                                {monthsData.map(m => (
                                    <React.Fragment key={m.key}>
                                        <td style={styles.tdGrandTotalValue}>
                                            {totals[m.key]?.count || 0}
                                        </td>
                                        <td style={styles.tdGrandTotalValue}>
                                            {fmtMoney(totals[m.key]?.amount || 0)}
                                        </td>
                                    </React.Fragment>
                                ))}
                                {/* Grand Total Column */}
                                <td style={styles.tdGrandTotalValue}>{grandTotal.count}</td>
                                <td style={styles.tdGrandTotalValue}>{fmtMoney(grandTotal.amount)}</td>
                            </tr>
                        )}

                        {repData.length === 0 && (
                            <tr>
                                <td colSpan={1 + (monthsData.length * 2) + 2} style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                                    No se encontraron renovaciones para el periodo seleccionado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
