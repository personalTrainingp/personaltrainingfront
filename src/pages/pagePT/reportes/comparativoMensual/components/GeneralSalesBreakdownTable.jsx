import React from 'react';
import { useGeneralSalesBreakdown } from '../hooks/useGeneralSalesBreakdown';
import { fmtMoney } from '../../resumenEjecutivo/adapters/executibleLogic';

export const GeneralSalesBreakdownTable = ({ ventas = [], monthsData = [] }) => {

    const { repData, totals, grandTotal } = useGeneralSalesBreakdown(ventas, monthsData);

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

    if (!monthsData || monthsData.length === 0) return null;

    return (
        <div style={styles.card}>
            <h5 style={styles.headerTitle}>  Ventas por ASESOR</h5>

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
                                <React.Fragment key={m.key}>
                                    <th style={styles.thSub}>CANTIDAD</th>
                                    <th style={styles.thSub}>IMPORTE</th>
                                </React.Fragment>
                            ))}

                            <th style={styles.thSub}>CANTIDAD</th>
                            <th style={styles.thSub}>IMPORTE</th>
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
                                    <td style={{ ...styles.tdStickyLeft, background: '#c00000' }}>{repName}</td>
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
                                    <td style={styles.tdTotalRow}>
                                        {rowCount > 0 ? rowCount : '-'}
                                    </td>
                                    <td style={{ ...styles.tdTotalRow, color: rowAmount > 0 ? '#000' : '#333' }}>
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

                            <td style={styles.tdGrandTotalValue}>
                                {grandTotal?.count > 0 ? grandTotal.count : '-'}
                            </td>
                            <td style={styles.tdGrandTotalValue}>
                                {grandTotal?.amount > 0 ? fmtMoney(grandTotal.amount) : '-'}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
