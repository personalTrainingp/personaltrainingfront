import React from 'react';
import { fmtMoney } from '../../resumenEjecutivo/adapters/executibleLogic';
import { useComparativoMensualLogic } from '../hooks/useComparativoMensualLogic';
import { RenovationsBreakdownTable } from './RenovationsBreakdownTable';
import { ClosingAnalysisTable } from './ClosingAnalysisTable';
import { GeneralSalesBreakdownTable } from './GeneralSalesBreakdownTable';
import { ClosingAnalysisTable2 } from './ClosingAnalysisTable2';
import { ReentryBreakdownTable } from './ReentryBreakdownTable';
import { NewMembersBreakdownTable } from './NewMembersBreakdownTable';
import { BonusAnalysisTable } from './BonusAnalysisTable';
import { RenovationAnalysisTable } from './RenovationAnalysisTable';

export const MetaAlcanceTable = ({ ventas = [], year, startMonth = 0, cutDay = 21, customStartDay = 1, customEndDay = 15 }) => {

    const { monthsData } = useComparativoMensualLogic({
        ventas,
        year,
        startMonth,
        cutDay
    });

    // --- ESTILOS ---
    const styles = {
        container: {
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            paddingBottom: '50px'
        },
        // Estilos para la tabla superior (Resumen)
        summaryCard: {
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            padding: '25px',
            marginBottom: '40px',
            border: '1px solid #f0f0f0'
        },
        summaryTitle: {
            fontSize: '22px',
            fontWeight: '800',
            color: '#1a1a1a',
            marginBottom: '20px',
            borderLeft: '5px solid #28a745', // Verde éxito
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
        thHead: {
            background: '#c00000',
            color: '#fff',
            padding: '12px 15px',
            textAlign: 'center',
            fontWeight: '600',
            textTransform: 'uppercase',
            borderRight: '1px solid #000'
        },
        thRowLabel: {
            background: '#c00000',
            padding: '12px 15px',
            textAlign: 'left',
            fontWeight: '800',
            color: '#fff',
            borderBottom: '1px solid #000',
            borderRight: '1px solid #000',
            minWidth: '150px',
            position: 'sticky',
            left: 0,
            zIndex: 2
        },
        td: {
            padding: '12px 15px',
            textAlign: 'right',
            borderBottom: '1px solid #000',
            borderRight: '1px solid #000',
            color: '#333'
        },
        // Variantes de texto
        textQuota: { color: '#666', fontWeight: '600' },
        textReach: { color: '#000', fontWeight: '800', fontSize: '20px' },
        textPctSuccess: { color: '#28a745', fontWeight: '800' }, // Verde
        textPctDanger: { color: '#dc3545', fontWeight: '800' }   // Rojo
    };

    return (
        <div style={styles.container}>

            {/* --- 1. TARJETA DE RESUMEN DE METAS --- */}
            <div style={styles.summaryCard}>
                <h4 style={styles.summaryTitle}>Resumen de Metas vs. Alcance</h4>

                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ ...styles.thHead, background: '#fff', color: '#333', borderRight: 'none' }}></th>
                                {monthsData.map((m) => (
                                    <th key={m.key} style={styles.thHead}>
                                        {m.label} <span style={{ fontSize: '11px', fontWeight: '400', opacity: 0.8 }}>{m.year}</span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={styles.thRowLabel}> CUOTA</td>
                                {monthsData.map((m) => (
                                    <td key={m.key} style={styles.td}>
                                        <span style={styles.textQuota}>{fmtMoney(m.quota)}</span>
                                    </td>
                                ))}
                            </tr>

                            <tr>
                                <td style={styles.thRowLabel}>ALCANCE</td>
                                {monthsData.map((m) => (
                                    <td key={m.key} style={{ ...styles.td, background: '#fcfcfc' }}>
                                        <span style={styles.textReach}>{fmtMoney(m.total)}</span>
                                    </td>
                                ))}
                            </tr>

                            <tr>
                                <td style={styles.thRowLabel}>% CUMPLIMIENTO</td>
                                {monthsData.map((m) => {
                                    const pct = m.quota > 0 ? (m.total / m.quota) * 100 : 0;
                                    const isSuccess = pct >= 100;
                                    return (
                                        <td key={m.key} style={styles.td}>
                                            <span style={isSuccess ? styles.textPctSuccess : styles.textPctDanger}>
                                                {pct.toFixed(1)}%
                                            </span>
                                        </td>
                                    );
                                })}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- 2. SECCIÓN DE DESGLOSES DETALLADOS --- */}

            {/* Título de sección opcional si quieres separar visualmente */}
            {/* <h5 className="mb-4 fw-bold text-muted" style={{marginTop:'50px'}}>DESGLOSE POR ORIGEN DE VENTA</h5> */}

            <GeneralSalesBreakdownTable
                ventas={ventas}
                monthsData={monthsData}
            />

            <ReentryBreakdownTable
                ventas={ventas}
                monthsData={monthsData}
            />

            <NewMembersBreakdownTable
                ventas={ventas}
                monthsData={monthsData}
            />

            <RenovationsBreakdownTable
                ventas={ventas}
                monthsData={monthsData}
                cutDay={cutDay}
            />

            <ClosingAnalysisTable
                ventas={ventas}
                monthsData={monthsData}
                customStartDay={customStartDay}
                customEndDay={customEndDay}
            />

            {/* TABLA NUEVA SOLICITADA (CORTE DINÁMICO) */}
            <ClosingAnalysisTable2
                ventas={ventas}
                monthsData={monthsData}
                customStartDay={customStartDay}
                customEndDay={customEndDay}
            />

            <BonusAnalysisTable
                ventas={ventas}
                monthsData={monthsData}
                customStartDay={customStartDay}
                customEndDay={customEndDay}
            />

            <RenovationAnalysisTable
                ventas={ventas}
                monthsData={monthsData}
            />

        </div>
    );
};