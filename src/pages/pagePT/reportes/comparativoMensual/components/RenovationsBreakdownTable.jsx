import React from 'react';
import { useRenovationsBreakdown } from '../hooks/useRenovationsBreakdown';
import { fmtMoney } from '../../resumenEjecutivo/adapters/executibleLogic';

export const RenovationsBreakdownTable = ({ ventas = [], monthsData = [] }) => {

    const { repData, totals, grandTotal } = useRenovationsBreakdown(ventas, monthsData);

    // --- ESTILOS ---
    const styles = {
        container: {
            marginTop: '30px',
            overflowX: 'auto',
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            padding: '15px'
        },
        title: {
            fontSize: '25px',
            fontWeight: '800',
            color: '#1a1a1a',
            borderLeft: '5px solid #c00000',
            paddingLeft: '10px',
            marginBottom: '15px',
            textTransform: 'uppercase'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '20px',
            fontFamily: "'Inter', sans-serif",
            whiteSpace: 'nowrap',
            border: '1px solid #ccc'
        },
        th: {
            border: '1px solid #999',
            padding: '8px 10px',
            textAlign: 'center',
            background: '#c00000',
            color: '#fff',
            fontWeight: '700',
            fontSize: '20px',
            textTransform: 'uppercase'
        },
        td: {
            border: '1px solid #ccc',
            padding: '6px 10px',
            textAlign: 'center',
            color: '#444'
        },
        repName: {
            textAlign: 'left',
            fontWeight: '700',
            color: '#000',
            background: '#fcfcfc',
            textTransform: 'capitalize'
        },
        totalRow: {
            background: '#d9d9d9',
            color: '#000',
            fontWeight: 'bold'
        },
        totalCell: {
            border: '1px solid #000',
            padding: '6px 10px',
            textAlign: 'center',
            color: '#000'
        }
    };

    if (monthsData.length === 0) return null;

    return (
        <div style={styles.container}>
            <h4 style={styles.title}>Desglose de Renovaciones</h4>

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={{ ...styles.th, verticalAlign: 'middle', width: '150px' }} rowSpan={2}>
                            ASESOR
                        </th>
                        {monthsData.map(m => (
                            <th key={m.key} style={styles.th} colSpan={2}>
                                {m.label}
                            </th>
                        ))}
                        <th style={styles.th} colSpan={2}>TOTAL</th>
                    </tr>
                    <tr>
                        {monthsData.map(m => (
                            <React.Fragment key={m.key + '-sub'}>
                                <th style={{ ...styles.th }}>CANTIDAD</th>
                                <th style={{ ...styles.th }}>IMPORTE</th>
                            </React.Fragment>
                        ))}
                        <th style={{ ...styles.th }}>CANTIDAD</th>
                        <th style={{ ...styles.th }}>IMPORTE</th>
                    </tr>
                </thead>
                <tbody>
                    {repData.map(([repName, monthMap]) => {
                        // Calculate row total
                        let rowCount = 0;
                        let rowAmount = 0;
                        monthMap.forEach(val => {
                            rowCount += val.count;
                            rowAmount += val.amount;
                        });

                        return (
                            <tr key={repName}>
                                <td style={{ ...styles.td, ...styles.repName }}>{repName}</td>
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
                                <td style={{ ...styles.td, fontWeight: 'bold' }}>{rowCount}</td>
                                <td style={{ ...styles.td, fontWeight: 'bold' }}>{fmtMoney(rowAmount)}</td>
                            </tr>
                        );
                    })}

                    {/* Fila de Totales */}
                    {repData.length > 0 && (
                        <tr style={styles.totalRow}>
                            <td style={{ ...styles.totalCell, textAlign: 'left', paddingLeft: '10px' }}>
                                TOTAL
                            </td>
                            {monthsData.map(m => (
                                <React.Fragment key={m.key}>
                                    <td style={styles.totalCell}>
                                        {totals[m.key]?.count || 0}
                                    </td>
                                    <td style={styles.totalCell}>
                                        {fmtMoney(totals[m.key]?.amount || 0)}
                                    </td>
                                </React.Fragment>
                            ))}
                            {/* Grand Total Column */}
                            <td style={styles.totalCell}>{grandTotal.count}</td>
                            <td style={styles.totalCell}>{fmtMoney(grandTotal.amount)}</td>
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
    );
};