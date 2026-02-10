import React from 'react';
import { useClosingAnalysis } from '../hooks/useClosingAnalysis';
import { fmtMoney } from '../../resumenEjecutivo/adapters/executibleLogic';

export const ClosingAnalysisTable = ({ ventas = [], monthsData = [] }) => {

    const reportData = useClosingAnalysis(ventas, monthsData);

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
            fontSize: '18px',
            fontWeight: '800',
            color: '#1a1a1a',
            borderLeft: '5px solid #ffcc00', // Yellow accent
            paddingLeft: '10px',
            marginBottom: '15px',
            textTransform: 'uppercase'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '16px',
            fontFamily: "'Inter', sans-serif",
            border: '1px solid #000'
        },
        thHeader: {
            background: 'yellow',
            border: '1px solid #000',
            padding: '8px',
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#000'
        },
        td: {
            border: '1px solid #000',
            padding: '6px 10px',
            textAlign: 'center',
            color: '#000'
        },
        monthCell: {
            textAlign: 'left',
            fontWeight: 'bold',
            paddingLeft: '10px',
            textTransform: 'capitalize'
        }
    };

    if (monthsData.length === 0) return null;

    return (
        <div style={styles.container}>
            <h4 style={styles.title}>Análisis de Cierre (Corte día 25)</h4>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.thHeader}>Mes</th>
                        <th style={styles.thHeader}>Venta 25 dias</th>
                        <th style={styles.thHeader}>Ultimos días</th>
                        <th style={styles.thHeader}>% ultimos días</th>
                        <th style={styles.thHeader}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {reportData.map(row => (
                        <tr key={row.key}>
                            <td style={{ ...styles.td, ...styles.monthCell }}>{row.label}</td>
                            <td style={styles.td}>{fmtMoney(row.firstPart)}</td>
                            <td style={styles.td}>{fmtMoney(row.lastPart)}</td>
                            <td style={styles.td}>{row.ratio.toFixed(2)}%</td>
                            <td style={styles.td}>{fmtMoney(row.total)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
