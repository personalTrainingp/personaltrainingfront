import React from 'react';
import { useComisionesLogic } from '../hooks/useComisionesLogic';
import { fmtMoney, fmtNum } from '../../resumenEjecutivo/adapters/executibleLogic';
import { Form, Row, Col, Button } from 'react-bootstrap';

export const ComisionesTable = ({ ventas = [], year, month, initDay = 1, cutDay = 31 }) => {
    const {
        cuotaSugerida, setCuotaSugerida, openPayParam,
        refRows, commissionData, addScaleRow, updateScaleCommission
    } = useComisionesLogic(ventas, year, month, initDay, cutDay);

    const styles = {
        card: { background: '#fff', padding: '25px', marginTop: '30px', fontFamily: "'Segoe UI', sans-serif" },
        headerTitle: { fontSize: '25px', fontWeight: '800', borderBottom: '3px solid #000', marginBottom: '20px', textTransform: 'uppercase' },
        tableBase: { width: '100%', borderCollapse: 'collapse', fontSize: '20px', border: '3px solid #000', marginBottom: '5px' },
        thGreen: { background: '#c00000', color: '#fff', padding: '6px', border: '1px solid #000', textAlign: 'center', fontWeight: 'bold' },
        thYellow: { background: '#c00000', color: '#fff', padding: '6px', border: '1px solid #000', textAlign: 'center', fontWeight: 'bold' },
        td: { border: '1px solid #000', padding: '5px', textAlign: 'right', color: '#000' },
        tdCenter: { border: '1px solid #000', padding: '5px', textAlign: 'center' },
        sectionTitle: { fontSize: '18px', fontWeight: '700', marginTop: '20px', marginBottom: '5px', color: '#000', textTransform: 'uppercase' },
        inputCom: { width: '60px', textAlign: 'right', fontWeight: 'bold', border: '1px solid #333' }
    };

    const renderHeaders = () => (
        <thead>
            <tr>
                <th style={styles.thYellow}>ALCANCE</th>
                <th style={styles.thYellow}>VENTA</th>
                <th style={styles.thYellow}>IGV</th>
                <th style={styles.thYellow}>BASE</th>
                <th style={styles.thYellow}>RENTA (3%)</th>
                <th style={styles.thYellow}>OPENPAY ({openPayParam}%)</th>
                <th style={styles.thYellow}>VENTAS NETAS</th>
                <th style={styles.thYellow}>% COMISION</th>
                <th style={styles.thYellow}>IMPORTE</th>
                <th style={styles.thYellow}>TOTAL</th>
            </tr>
        </thead>
    );

    return (
        <div style={styles.card}>
            <h5 style={styles.headerTitle}>CUOTA MES DE {month}/{year}</h5>

            <div style={{ background: '#ffffcc', padding: '15px', marginBottom: '20px' }}>
                <Row className="align-items-center mb-2">
                    <Col xs="auto"><Form.Label className="fw-bold mb-0 text-danger">CUOTA SUGERIDA TOTAL:</Form.Label></Col>
                    <Col xs="auto">
                        <Form.Control type="number" value={cuotaSugerida} onChange={(e) => setCuotaSugerida(Number(e.target.value))} style={{ fontWeight: 'bold', textAlign: 'right' }} />
                    </Col>
                </Row>
                <div style={{ display: 'flex', gap: '20px', fontSize: '18px' }}>
                    {commissionData.map((adv, idx) => (
                        <div key={idx}>
                            <strong>{adv.advisor}: Meta {fmtMoney(cuotaSugerida / 2)} <br /> Real: <span className="text-danger">{fmtMoney(adv.realData.venta)}</span></strong>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- TABLA RESUMEN REAL --- */}
            <h6 className="fw-bold text-uppercase" style={{ color: '#c00000', marginTop: '30px' }}>RESUMEN DE COMISIONES REALES (BASADO EN VENTA ACTUAL)</h6>
            <table style={styles.tableBase}>
                <thead>
                    <tr>
                        <th style={styles.thGreen}>ASESOR</th>
                        <th style={styles.thYellow}>CUOTA INDIVIDUAL</th>
                        <th style={styles.thYellow}>VENTA REAL</th>
                        <th style={styles.thYellow}>IGV</th>
                        <th style={styles.thYellow}>BASE</th>
                        <th style={styles.thYellow}>RENTA (3%)</th>
                        <th style={styles.thYellow}>OPENPAY ({openPayParam}%)</th>
                        <th style={styles.thYellow}>VENTAS NETAS</th>
                        <th style={styles.thYellow}>ALCANCE (%)</th>
                        <th style={styles.thYellow}>% COMISION</th>
                        <th style={styles.thYellow}>COMISIÓN</th>
                    </tr>
                </thead>
                <tbody>
                    {commissionData.map((adv, idx) => (
                        <tr key={idx}>
                            <td style={{ ...styles.td, textAlign: 'center', fontWeight: 'bold', background: '#c00000', color: '#fff' }}>{adv.advisor}</td>
                            <td style={styles.td}>{fmtMoney(cuotaSugerida / 2)}</td>
                            <td style={{ ...styles.td, fontWeight: 'bold' }}>{fmtMoney(adv.realData.venta)}</td>
                            <td style={styles.td}>{fmtMoney(adv.realData.igv)}</td>
                            <td style={styles.td}>{fmtMoney(adv.realData.base)}</td>
                            <td style={styles.td}>{fmtMoney(adv.realData.renta)}</td>
                            <td style={styles.td}>{fmtMoney(adv.realData.openPay)}</td>
                            <td style={{ ...styles.td, fontWeight: 'bold' }}>{fmtMoney(adv.realData.ventasNetas)}</td>
                            <td style={{ ...styles.td, textAlign: 'center' }}><strong>{adv.realData.alcance.toFixed(2)}%</strong></td>
                            <td style={{ ...styles.td, background: '#e8f5e9', textAlign: 'center' }}>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={adv.realData.com}
                                    disabled={adv.realData.index === -1}
                                    onChange={(e) => updateScaleCommission(adv.realData.index, e.target.value)}
                                    style={styles.inputCom}
                                /> %
                            </td>
                            <td style={{ ...styles.td, background: '#c00000', fontWeight: 'bold', color: '#fff' }}>{fmtMoney(adv.realData.totalComision)}</td>
                        </tr>
                    ))}
                    <tr style={{ background: '#eee', fontWeight: 'bold' }}>
                        <td style={{ ...styles.td, textAlign: 'center' }}>TOTAL</td>
                        <td style={styles.td}>{fmtMoney(cuotaSugerida)}</td>
                        <td style={styles.td}>{fmtMoney(commissionData.reduce((acc, a) => acc + a.realData.venta, 0))}</td>
                        <td style={styles.td}>{fmtMoney(commissionData.reduce((acc, a) => acc + a.realData.igv, 0))}</td>
                        <td style={styles.td}>{fmtMoney(commissionData.reduce((acc, a) => acc + a.realData.base, 0))}</td>
                        <td style={styles.td}>{fmtMoney(commissionData.reduce((acc, a) => acc + a.realData.renta, 0))}</td>
                        <td style={styles.td}>{fmtMoney(commissionData.reduce((acc, a) => acc + a.realData.openPay, 0))}</td>
                        <td style={styles.td}>{fmtMoney(commissionData.reduce((acc, a) => acc + a.realData.ventasNetas, 0))}</td>
                        <td style={styles.td}>-</td>
                        <td style={styles.td}>-</td>
                        <td style={{ ...styles.td, fontSize: '22px' }}>
                            {fmtMoney(commissionData.reduce((acc, a) => acc + a.realData.totalComision, 0))}
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* --- TABLA 1: REFERENCIA (EDITABLE) --- */}
            <h6 className="fw-bold">TABLA DE COMISIONES (REFERENCIA)</h6>
            <table style={styles.tableBase}>
                {renderHeaders()}
                <tbody>
                    {refRows.map((row, idx) => {
                        if (row.pct < 95) return null;
                        return (
                            <tr key={idx} style={{ background: row.pct === 100 ? '#e0e0e0' : '#fff' }}>
                                <td style={styles.tdCenter}><strong>{row.pct}%</strong></td>
                                <td style={styles.td}><strong>{fmtMoney(row.data.venta)}</strong></td>
                                <td style={{ ...styles.td, color: '#666' }}>{fmtMoney(row.data.igv)}</td>
                                <td style={styles.td}>{fmtMoney(row.data.base)}</td>
                                <td style={styles.td}>{fmtMoney(row.data.renta)}</td>
                                <td style={styles.td}>{fmtMoney(row.data.openPay)}</td>
                                <td style={styles.td}><strong>{fmtMoney(row.data.ventasNetas)}</strong></td>
                                <td style={{ ...styles.td, background: '#e8f5e9', textAlign: 'center' }}>
                                    <input type="number" step="0.1" value={row.com} onChange={(e) => updateScaleCommission(row.index, e.target.value)} style={styles.inputCom} /> %
                                </td>
                                <td style={{ ...styles.td, fontWeight: 'bold' }}>{fmtMoney(row.data.importeComision)}</td>
                                <td style={{ ...styles.td, fontWeight: 'bold' }}>{fmtMoney(row.data.totalComision)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <Button variant="success" size="sm" className="mb-4" onClick={addScaleRow}>+ Escala</Button>

            {/* --- SECCIÓN POR VENDEDOR --- */}
            {commissionData.map(adv => (
                <div key={adv.advisor} className="mb-5">
                    <div style={{ background: '#eee', padding: '8px', borderLeft: '5px solid #000', marginBottom: '10px' }}>
                        <h5 className="fw-bold m-0" style={{ fontSize: '23px' }}>{adv.advisor}</h5>
                    </div>

                    {/* A. TABLA PROYECCIÓN MENSUAL (6 FILAS) */}
                    <div style={styles.sectionTitle}>(PORCENTAJE DEL TOTAL)</div>
                    <table style={styles.tableBase}>
                        {renderHeaders()}
                        <tbody>
                            {adv.projections.map((row, idx) => (
                                <tr key={idx} style={{ background: row.pct === 100 ? '#e0e0e0' : (idx % 2 === 0 ? '#fff' : '#f9f9f9') }}>
                                    <td style={styles.tdCenter}><strong>{row.pct}%</strong></td>
                                    <td style={{ ...styles.td, background: '#ccc' }}><strong>{fmtMoney(row.venta)}</strong></td>
                                    <td style={styles.td}>{fmtMoney(row.igv)}</td>
                                    <td style={styles.td}>{fmtMoney(row.base)}</td>
                                    <td style={styles.td}>{fmtMoney(row.renta)}</td>
                                    <td style={styles.td}>{fmtMoney(row.openPay)}</td>
                                    <td style={styles.td}><strong>{fmtMoney(row.ventasNetas)}</strong></td>
                                    {/* INPUT EDITABLE TAMBIÉN AQUÍ (Vinculado al state global) */}
                                    <td style={{ ...styles.td, background: '#e8f5e9', textAlign: 'center' }}>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={row.com}
                                            onChange={(e) => updateScaleCommission(row.index, e.target.value)}
                                            style={styles.inputCom}
                                        /> %
                                    </td>
                                    <td style={styles.td}>{fmtMoney(row.importeComision)}</td>
                                    <td style={{ ...styles.td, fontWeight: 'bold', border: '2px solid #000' }}>{fmtMoney(row.totalComision)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* B. TABLA QUINCENA (NUEVA - 2 FILAS) */}
                    <div style={styles.sectionTitle}>(AVANCE AL 40% HASTA QUINCENA)</div>
                    <table style={styles.tableBase}>
                        {renderHeaders()}
                        <tbody>
                            {adv.quincenaData.map((row, idx) => (
                                <tr key={idx} style={{ background: row.pct === 100 ? '#e0e0e0' : (idx % 2 === 0 ? '#fff' : '#fff') }}>
                                    <td style={{ ...styles.tdCenter, fontWeight: 'bold' }}>{row.alcance}</td>
                                    <td style={{ ...styles.td, fontWeight: 'bold' }}>{fmtMoney(row.venta)}</td>
                                    <td style={styles.td}>{fmtMoney(row.igv)}</td>
                                    <td style={{ ...styles.td, fontWeight: 'bold' }}>{fmtMoney(row.base)}</td>
                                    <td style={styles.td}>{fmtMoney(row.renta)}</td>
                                    <td style={styles.td}>{fmtMoney(row.openPay)}</td>
                                    <td style={{ ...styles.td, fontWeight: 'bold' }}>{fmtMoney(row.ventasNetas)}</td>
                                    {/* INPUT EDITABLE QUINCENA (Vinculado) */}
                                    <td style={{ ...styles.td, background: '#e8f5e9', textAlign: 'center' }}>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={row.com}
                                            onChange={(e) => updateScaleCommission(row.index, e.target.value)}
                                            style={styles.inputCom}
                                        /> %
                                    </td>
                                    <td style={{ ...styles.td, fontWeight: 'bold' }}>{fmtMoney(row.importeComision)}</td>
                                    <td style={{ ...styles.td, fontWeight: 'bold', border: '2px solid #000' }}>{fmtMoney(row.totalComision)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};