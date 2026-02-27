import React from 'react';
import { useClosingAnalysis } from '../hooks/useClosingAnalysis';
import { fmtMoney, fmtNum } from '../../resumenEjecutivo/adapters/executibleLogic'; // Asumo que fmtNum existe, si no, usa toFixed

export const ClosingAnalysisTable = ({ ventas = [], monthsData = [], customStartDay = 1, customEndDay = 1 }) => {

    const reportData = useClosingAnalysis(ventas, monthsData, customStartDay, customEndDay);

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
            borderLeft: '5px solid #ffcc00', // Mantenemos tu acento amarillo de identidad
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
            fontSize: '22px',
            whiteSpace: 'nowrap'
        },
        th: {
            background: '#c00000', // Rojo consistente con tus otros reportes
            color: '#fff',
            fontWeight: '600',
            padding: '12px 15px',
            textAlign: 'center',
            fontSize: '22px',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            borderRight: '1px solid rgba(255,255,255,0.2)'
        },
        td: {
            padding: '12px 15px',
            borderBottom: '1px solid #f0f0f0',
            color: '#444',
            textAlign: 'right' // Números a la derecha siempre
        },
        tdLabel: {
            textAlign: 'left',
            fontWeight: '700',
            color: '#222',
            textTransform: 'capitalize',
            background: '#fff',
            position: 'sticky',
            left: 0,
            zIndex: 1,
            borderRight: '2px solid #f5f5f5'
        },
        ratioCell: {
            fontWeight: '600',
            color: '#555',
            background: '#fafafa'
        },
        totalCell: {
            fontWeight: '800',
            color: '#000',
            background: 'rgba(0,0,0,0.02)'
        }
    };

    if (monthsData.length === 0) return null;

    return (
        <div style={styles.card}>
            <div style={styles.headerContainer}>
                <h4 style={styles.title}>Análisis de Renovaciones (Corte Estándar día 25)</h4>
                <small style={{ color: '#888', paddingLeft: '20px', display: 'block', marginTop: '5px' }}>
                    Comparativa de rendimiento final de mes
                </small>
            </div>

            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ ...styles.th, textAlign: 'left', paddingLeft: '20px' }}>Mes</th>
                            <th style={styles.th}>Venta (Días 1-25)</th>
                            <th style={{ ...styles.th, background: '#efef4cff', color: '#000', border: '1px solid #000' }}>
                                RANGO ({customStartDay}-{customEndDay})
                            </th>
                            <th style={styles.th}>Cierre (Día 26-Fin)</th>
                            <th style={styles.th}>% Cierre</th>
                            <th style={styles.th}>Total Mes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.map((row, idx) => (
                            <tr key={row.key} style={{ background: idx % 2 === 0 ? '#fff' : '#fcfcfc' }}>
                                <td style={{ ...styles.td, ...styles.tdLabel, paddingLeft: '20px' }}>
                                    {row.label}
                                </td>

                                <td style={styles.td}>{fmtMoney(row.firstPart)}</td>

                                <td style={{ ...styles.td, background: '#efef4cff', fontWeight: 'bold' }}>
                                    {fmtMoney(row.customRange)}
                                </td>

                                <td style={{ ...styles.td, color: '#c00000', fontWeight: '600' }}>
                                    {fmtMoney(row.lastPart)}
                                </td>

                                <td style={{ ...styles.td, ...styles.ratioCell, textAlign: 'center' }}>
                                    {row.ratio.toFixed(1)}%
                                </td>

                                <td style={{ ...styles.td, ...styles.totalCell }}>
                                    {fmtMoney(row.total)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};