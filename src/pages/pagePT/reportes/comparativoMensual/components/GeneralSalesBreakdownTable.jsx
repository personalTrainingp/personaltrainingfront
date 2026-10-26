import React, { useState } from 'react';
import { useGeneralSalesBreakdown } from '../hooks/useGeneralSalesBreakdown';
import { fmtMoney } from '../../resumenEjecutivo/adapters/executibleLogic';
import { ClickableTd, DetalleVentasModal } from './DetalleVentasModal';

export const GeneralSalesBreakdownTable = ({ ventas = [], monthsData = [], customStartDay = 1, customEndDay = 31 }) => {

    const { repData, totals, grandTotal } = useGeneralSalesBreakdown(ventas, monthsData, customStartDay, customEndDay);

    const [detalle, setDetalle] = useState(null);
    const openDetalle = (titulo, items) => setDetalle({ titulo, items });

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
                                    <th style={styles.thSub}>SOCIOS</th>
                                    <th style={styles.thSub}>IMPORTE</th>
                                </React.Fragment>
                            ))}

                            <th style={styles.thSub}>SOCIOS</th>
                            <th style={styles.thSub}>IMPORTE</th>
                        </tr>
                    </thead>

                    <tbody>
                        {repData.map(([repName, monthMap], idx) => {
                            // Calcular totales horizontales
                            let rowCount = 0;
                            let rowAmount = 0;
                            const rowItems = [];

                            const cells = monthsData.map(m => {
                                const data = monthMap.get(m.key);
                                if (data) {
                                    rowCount += data.count;
                                    rowAmount += data.amount;
                                    rowItems.push(...data.items);
                                }
                                return data;
                            });

                            return (
                                <tr key={repName} style={{ background: idx % 2 === 0 ? '#fff' : '#fcfcfc' }}>
                                    <td style={{ ...styles.tdStickyLeft, background: '#c00000' }}>{repName}</td>
                                    {cells.map((data, i) => (
                                        <React.Fragment key={i}>
                                            <ClickableTd style={styles.td} items={data?.items} onOpen={() => openDetalle(`${repName} · ${monthsData[i].label}`, data?.items)}>
                                                {data && data.count > 0 ? data.count : '-'}
                                            </ClickableTd>
                                            <ClickableTd style={styles.td} items={data?.items} onOpen={() => openDetalle(`${repName} · ${monthsData[i].label}`, data?.items)}>
                                                {data && data.amount > 0 ? fmtMoney(data.amount) : '-'}
                                            </ClickableTd>
                                        </React.Fragment>
                                    ))}
                                    <ClickableTd style={styles.tdTotalRow} items={rowItems} onOpen={() => openDetalle(`${repName} · TOTAL ACUMULADO`, rowItems)}>
                                        {rowCount > 0 ? rowCount : '-'}
                                    </ClickableTd>
                                    <ClickableTd style={{ ...styles.tdTotalRow, color: rowAmount > 0 ? '#000' : '#333' }} items={rowItems} onOpen={() => openDetalle(`${repName} · TOTAL ACUMULADO`, rowItems)}>
                                        {rowAmount > 0 ? fmtMoney(rowAmount) : '-'}
                                    </ClickableTd>
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
                                        <ClickableTd style={styles.tdGrandTotalValue} items={total?.items} onOpen={() => openDetalle(`TOTAL · ${m.label}`, total?.items)}>
                                            {total && total.count > 0 ? total.count : '-'}
                                        </ClickableTd>
                                        <ClickableTd style={styles.tdGrandTotalValue} items={total?.items} onOpen={() => openDetalle(`TOTAL · ${m.label}`, total?.items)}>
                                            {total && total.amount > 0 ? fmtMoney(total.amount) : '-'}
                                        </ClickableTd>
                                    </React.Fragment>
                                );
                            })}

                            <ClickableTd style={styles.tdGrandTotalValue} items={grandTotal?.items} onOpen={() => openDetalle('TOTAL ACUMULADO', grandTotal?.items)}>
                                {grandTotal?.count > 0 ? grandTotal.count : '-'}
                            </ClickableTd>
                            <ClickableTd style={styles.tdGrandTotalValue} items={grandTotal?.items} onOpen={() => openDetalle('TOTAL ACUMULADO', grandTotal?.items)}>
                                {grandTotal?.amount > 0 ? fmtMoney(grandTotal.amount) : '-'}
                            </ClickableTd>
                        </tr>
                    </tbody>
                </table>
            </div>
            <DetalleVentasModal detalle={detalle} onHide={() => setDetalle(null)} />
        </div>
    );
};
