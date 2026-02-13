import React from 'react';
import { useRenovationAnalysis } from '../hooks/useRenovationAnalysis';

export const RenovationAnalysisTable = ({ ventas = [], monthsData }) => {

    // We reuse monthsData to know which months to display
    const data = useRenovationAnalysis(ventas, monthsData);

    const styles = {
        container: {
            marginTop: '40px',
            marginBottom: '40px',
            fontFamily: "'Segoe UI', sans-serif"
        },
        title: {
            fontSize: '25px',
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
            fontSize: '21px',
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
            textAlign: 'center'
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
            <h5 style={styles.title}>ANALISIS RENOVACIONES MES A MES</h5>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={{ ...styles.th, textAlign: 'left' }}>Mes</th>
                        <th style={styles.th}>Cantidad<br /> Ventas</th>
                        <th style={styles.th}>Cantidad<br />renovaciones</th>
                        <th style={styles.th}>Porcentaje</th>
                    </tr>
                </thead>
                <tbody>
                    {(() => {
                        const withPct = data.map(r => ({ ...r, pct: r.totalCount > 0 ? (r.renovationCount / r.totalCount) : 0 }));
                        const sorted = [...withPct].sort((a, b) => b.pct - a.pct);
                        const top3Keys = sorted.slice(0, 3).map(x => x.key);

                        return data.map((row, idx) => {
                            const pct = row.totalCount > 0 ? (row.renovationCount / row.totalCount) * 100 : 0;
                            const isTop3 = row.key && top3Keys.includes(row.key);
                            return (
                                <tr key={idx} style={{ background: isTop3 ? '#efef4cff' : '#fff' }}>
                                    <td style={styles.tdMonth}>{row.label}</td>
                                    <td style={styles.tdNumber}>{row.totalCount}</td>
                                    <td style={styles.tdNumber}>{row.renovationCount}</td>
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
