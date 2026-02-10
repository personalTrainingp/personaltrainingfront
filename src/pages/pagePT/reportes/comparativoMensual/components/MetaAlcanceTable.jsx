import React from 'react';
import { fmtMoney } from '../../resumenEjecutivo/adapters/executibleLogic';
import { useComparativoMensualLogic } from '../hooks/useComparativoMensualLogic';
import { RenovationsBreakdownTable } from './RenovationsBreakdownTable';
import { ClosingAnalysisTable } from './ClosingAnalysisTable';

export const MetaAlcanceTable = ({ ventas = [], year, startMonth = 0, cutDay = 21 }) => {
    const { monthsData } = useComparativoMensualLogic({
        ventas,
        year,
        startMonth,
        cutDay
    });
    const styles = {
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '18px',
            fontFamily: 'sans-serif',
            marginBottom: '20px',
            border: '1px solid #000'
        },
        thLabel: {
            background: 'yellow',
            fontWeight: 'bold',
            border: '1px solid #000',
            padding: '5px',
            textAlign: 'left',
            color: '#000',
            width: '100px'
        },
        td: {
            border: '1px solid #000',
            padding: '5px',
            textAlign: 'center',
            color: '#000'
        },
        moneyText: {
            color: '#00a000', // Greenish similar to excel
            fontWeight: 'bold'
        },
        mesText: {
            textTransform: 'uppercase',
            fontWeight: 'bold'
        }
    };

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
                <tbody>
                    {/* Fila 1: CUOTA */}
                    <tr>
                        <th style={styles.thLabel}>CUOTA</th>
                        {monthsData.map((m) => (
                            <td key={m.key} style={styles.td}>
                                <span style={styles.moneyText}>
                                    {fmtMoney(m.quota)}
                                </span>
                            </td>
                        ))}
                    </tr>

                    {/* Fila 2: ALCANCE */}
                    <tr>
                        <th style={styles.thLabel}>ALCANCE</th>
                        {monthsData.map((m) => (
                            <td key={m.key} style={styles.td}>
                                {fmtMoney(m.total)}
                            </td>
                        ))}
                    </tr>

                    {/* Fila 3: MES */}
                    <tr>
                        <th style={styles.thLabel}>MES</th>
                        {monthsData.map((m) => (
                            <td key={m.key} style={{ ...styles.td, ...styles.mesText }}>
                                {m.label}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>

            <h5 className="mt-4 mb-2 fw-bold text-muted">DETALLE RENOVACIONES POR VENDEDOR</h5>
            <RenovationsBreakdownTable
                ventas={ventas}
                monthsData={monthsData}
                cutDay={cutDay}
            />

            <ClosingAnalysisTable
                ventas={ventas}
                monthsData={monthsData}
            />
        </div>
    );
};
