import React from 'react';
import { useBonusAnalysis } from '../hooks/useBonusAnalysis';
import { fmtMoney } from '../../resumenEjecutivo/adapters/executibleLogic';

export const BonusAnalysisTable = ({ ventas = [], monthsData, customStartDay = 1, customEndDay = 1 }) => {

    // We reuse monthsData to know which months to display
    const data = useBonusAnalysis(ventas, monthsData, customStartDay, customEndDay);

    const styles = {
        container: {
            marginTop: '40px',
            marginBottom: '40px',
            fontFamily: "'Segoe UI', sans-serif"
        },
        title: {
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '15px',
            textTransform: 'uppercase',
            color: '#333',
            borderLeft: '5px solid #FFD700', // Gold
            paddingLeft: '10px'
        },
        table: {
            width: '100%',
            maxWidth: '800px',
            borderCollapse: 'collapse',
            fontSize: '20px',
            border: '2px solid #000'
        },
        th: {
            background: '#c00000', // Yellow as in image
            color: '#fff',
            fontWeight: 'bold',
            padding: '10px',
            border: '1px solid #000',
            textAlign: 'center'
        },
        td: {
            padding: '10px',
            border: '1px solid #000',
            color: '#000'
        },
        tdMonth: {
            padding: '10px',
            border: '1px solid #000',
            textAlign: 'left',
            fontWeight: '600'
        },
        tdNumber: {
            padding: '10px',
            border: '1px solid #000',
            textAlign: 'right'
        },
        tdPercent: {
            padding: '10px',
            border: '1px solid #000',
            textAlign: 'center',
            fontWeight: 'bold'
        }
    };

    return (
        <div style={styles.container}>
            <h5 style={styles.title}>ANÁLISIS BONIFICACIÓN POR AVANCE (Corte Estándar 15)</h5>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={{ ...styles.th, textAlign: 'left' }}>Mes</th>
                        <th style={styles.th}>Avance 1-15</th>
                        <th style={{ ...styles.th, background: '#efef4cff', color: '#000', border: '1px solid #000' }}>
                            Avance ({customStartDay}-{customEndDay})
                        </th>
                        <th style={styles.th}>Meta</th>
                        <th style={styles.th}>Porcentaje</th>
                    </tr>
                </thead>
                <tbody>
                    {(() => {
                        // Calcular Top 3 basado en porcentaje
                        const withPct = data.map(r => ({ ...r, pct: r.meta > 0 ? (r.accumulated / r.meta) : 0 }));
                        const sorted = [...withPct].sort((a, b) => b.pct - a.pct);

                        const top3Keys = sorted.slice(0, 3).map(x => x.key);

                        return data.map((row, idx) => {
                            const pct = row.meta > 0 ? (row.accumulated / row.meta) * 100 : 0;
                            const isTop3 = row.key && top3Keys.includes(row.key);

                            return (
                                <tr key={idx} style={{ background: isTop3 ? '#efef4cff' : '#fff' }}>
                                    <td style={styles.tdMonth}>{row.label}</td>
                                    <td style={styles.tdNumber}>{fmtMoney(row.accumulated)}</td>
                                    <td style={{ ...styles.td, background: '#efef4cff', fontWeight: 'bold', textAlign: 'right' }}>
                                        {fmtMoney(row.customRange)}
                                    </td>
                                    <td style={styles.tdNumber}>{fmtMoney(row.meta)}</td>
                                    <td style={styles.tdPercent}>{pct.toFixed(2)}%</td>
                                </tr>
                            );
                        });
                    })()}
                </tbody>
            </table>
        </div>
    );
};
