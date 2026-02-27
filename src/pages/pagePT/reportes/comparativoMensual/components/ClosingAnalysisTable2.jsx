import React from 'react';
import { useClosingAnalysis24Days } from '../hooks/useClosingAnalysis24Days';
import { fmtMoney } from '../../resumenEjecutivo/adapters/executibleLogic';

export const ClosingAnalysisTable2 = ({ ventas = [], monthsData = [], customStartDay = 1, customEndDay = 1 }) => {

    const reportData = useClosingAnalysis24Days(ventas, monthsData, customStartDay, customEndDay);

    // Calcular Top 3 basado en ratio (% ultimos 6 dias)
    const sorted = [...reportData].sort((a, b) => b.ratio - a.ratio);
    const top3Keys = sorted.slice(0, 3).map(x => x.key);

    const styles = {
        card: {
            marginTop: '30px',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            padding: '25px',
            fontFamily: "'Inter', 'Segoe UI', sans-serif"
        },
        headerContainer: {
            marginBottom: '20px',
            borderBottom: '1px solid #eee',
            paddingBottom: '15px'
        },
        title: {
            fontSize: '27px',
            fontWeight: '800',
            color: '#1a1a1a',
            margin: 0,
            borderLeft: '5px solid #ffcc00', // Amarillo
            paddingLeft: '15px',
            lineHeight: '1',
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
        th: {
            background: '#c00000', // Amarillo como en la imagen
            color: '#fff',
            fontWeight: '700',
            padding: '12px 15px',
            textAlign: 'center',
            fontSize: '20px',
            letterSpacing: '0.5px',
            textTransform: 'none', // La imagen tiene texto normal/capitalizado
            border: '1px solid #000'
        },
        td: {
            padding: '10px 15px',
            border: '1px solid #000',
            color: '#000',
            textAlign: 'right',
            fontSize: '20px'
        },
        tdLabel: {
            textAlign: 'left',
            fontWeight: '600',
            color: '#000',
            textTransform: 'capitalize',
            background: '#fff',
        }
    };

    if (monthsData.length === 0) return null;

    return (
        <div style={styles.card}>
            <div style={styles.headerContainer}>
                <h4 style={styles.title}>ANÁLISIS DE SOCIOS NUEVOS (CORTE ESTÁNDAR DÍA 24)</h4>
            </div>

            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ ...styles.th, textAlign: 'center' }}>Mes</th>
                            <th style={styles.th}>Venta 24 dias</th>
                            <th style={{ ...styles.th, background: '#efef4cff', color: '#000', border: '1px solid #000' }}>
                                RANGO ({customStartDay}-{customEndDay})
                            </th>
                            <th style={styles.th}>Cierre (Día 25-Fin)</th>
                            <th style={styles.th}>% Cierre</th>
                            <th style={styles.th}>Total</th>
                            <th style={styles.th}>Cuotas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.map((row, idx) => {
                            const isTop3 = top3Keys.includes(row.key);
                            return (
                                <tr key={row.key} style={{ background: isTop3 ? '#efef4cff' : '#fff' }}>
                                    <td style={{ ...styles.td, ...styles.tdLabel }}>
                                        {row.label}
                                    </td>

                                    <td style={styles.td}>{fmtMoney(row.firstPart)}</td>

                                    <td style={{ ...styles.td, background: '#efef4cff', fontWeight: 'bold' }}>
                                        {fmtMoney(row.customRange)}
                                    </td>

                                    <td style={styles.td}>{fmtMoney(row.lastPart)}</td>

                                    <td style={{ ...styles.td, textAlign: 'center' }}>
                                        {row.ratio.toFixed(2)}%
                                    </td>

                                    <td style={styles.td}>
                                        {fmtMoney(row.total)}
                                    </td>

                                    <td style={styles.td}>
                                        {fmtMoney(row.quota)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
