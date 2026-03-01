import React from 'react';
import { useComisionesLogic } from '../hooks/useComisionesLogic';
import { fmtMoney, fmtNum } from '../../resumenEjecutivo/adapters/executibleLogic';
import { Form, Row, Col, Button } from 'react-bootstrap';

export const ComisionesTable = ({ ventas = [], year, month, initDay = 1, cutDay = 31 }) => {
    const {
        cuotaSugerida, setCuotaSugerida, openPayParam,
        refRows, commissionData, addScaleRow, updateScaleCommission
    } = useComisionesLogic(ventas, year, month, initDay, cutDay);

    const [inputCuota, setInputCuota] = React.useState(fmtNum(cuotaSugerida));

    React.useEffect(() => {
        setInputCuota(fmtNum(cuotaSugerida));
    }, [cuotaSugerida]);

    const handleCuotaChange = (e) => {
        const val = e.target.value.replace(/,/g, '');
        if (/^\d*$/.test(val)) {
            setInputCuota(e.target.value);
            setCuotaSugerida(Number(val));
        }
    };

    const handleCuotaBlur = () => {
        setInputCuota(fmtNum(cuotaSugerida));
    };

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
                <th style={styles.thYellow}> <br /> VENTA <br /> S/</th>
                <th style={styles.thYellow}> <br /> IGV <br /> S/</th>
                <th style={styles.thYellow}> <br /> BASE <br /> S/</th>
                <th style={styles.thYellow}>RENTA <br /> (3%) <br /> S/</th>
                <th style={styles.thYellow}>OPENPAY <br /> ({openPayParam}%) <br /> S/</th>
                <th style={styles.thYellow}>VENTA <br /> NETA <br /> S/</th>
                <th style={styles.thYellow}> <br /> % <br />COMISIÓN</th>
                <th style={styles.thYellow}> <br /> IMPORTE <br /> S/</th>
                <th style={styles.thYellow}> <br />TOTAL <br /> S/</th>
            </tr>
        </thead>
    );

    return (
        <div style={styles.card}>
            <h5 style={styles.headerTitle}>CUOTA MES DE {month}/{year}</h5>

            <div style={{
                background: '#f8f9fa',
                padding: '20px',
                marginBottom: '25px',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
                <Row className="align-items-center mb-3">
                    <Col xs="auto">
                        <Form.Label className="fw-bold mb-0" style={{
                            color: '#333',
                            fontSize: '28px',
                            lineHeight: '1',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            CUOTA :
                        </Form.Label>
                    </Col>
                    <Col xs="auto">
                        <Form.Control
                            type="text"
                            value={inputCuota}
                            onChange={handleCuotaChange}
                            onBlur={handleCuotaBlur}
                            size="lg"              // <-- 1. Le dice a Bootstrap que es un input grande
                            className="fs-2"       // <-- 2. Fuerza el tamaño de fuente (fs-1 es más grande, fs-3 más chico)
                            style={{
                                fontWeight: 'bold',
                                textAlign: 'right',
                                width: '300px',
                                height: '70px',
                                padding: '0 20px',
                                border: '2px solid #dee2e6',
                                borderRadius: '8px',
                                backgroundColor: '#fff'
                                // Puedes quitar el fontSize de aquí
                            }}
                        />
                    </Col>
                </Row>

                <div style={{
                    display: 'flex',
                    gap: '20px',
                    fontSize: '20px',
                    borderTop: '1px solid #dee2e6',
                    paddingTop: '15px',
                    flexWrap: 'wrap'
                }}>
                    {commissionData.map((adv, idx) => (
                        <div key={idx} style={{
                            background: '#fff',
                            padding: '12px 18px',
                            borderRadius: '6px',
                            border: '1px solid #ddd',
                            minWidth: '220px',
                            flex: '1 1 auto'
                        }}>
                            <div style={{ color: '#333', fontWeight: '800', marginBottom: '8px', fontSize: '21px', textTransform: 'uppercase' }}>
                                {adv.advisor}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ color: '#666' }}>Meta :</span>
                                <strong>{fmtMoney(cuotaSugerida / 2)}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#666' }}>CUOTA:</span>
                                {/* Usamos un color azul oscuro/corporativo para el dato real en lugar de rojo */}
                                <strong style={{ color: '#0056b3' }}>{fmtMoney(adv.realData.venta)}</strong>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- TABLA RESUMEN REAL --- */}
            <h6 className="fw-bold text-uppercase" style={{ color: '#c00000', marginTop: '25px' }}>RESUMEN DE COMISIONES REALES (BASADO EN VENTA ACTUAL)</h6>
            <table style={styles.tableBase}>
                <thead>
                    <tr>
                        <th style={styles.thGreen}>ASESOR</th>
                        <th style={styles.thYellow}>CUOTA <br />MENSUAL<br /> S/</th>
                        <th style={styles.thYellow}>CUOTA <br />ALCANZADA<br /> S/</th>
                        <th style={styles.thYellow}> <br /> IGV<br /> S/</th>
                        <th style={styles.thYellow}> Venta<br /> BASE <br /> S/</th>
                        <th style={styles.thYellow}>RENTA <br /> (3%) <br /> S/</th>
                        <th style={styles.thYellow}>OPENPAY <br /> ({openPayParam}%) <br /> S/</th>
                        <th style={styles.thYellow}>VENTA <br /> NETA <br /> S/</th>
                        <th style={styles.thYellow}> <br />ALCANCE <br /> (%)</th>
                        <th style={styles.thYellow}> <br /> % <br />COMISION</th>
                        <th style={styles.thYellow}> <br />COMISIÓN <br /> S/</th>
                    </tr>
                </thead>
                <tbody>
                    {commissionData.map((adv, idx) => (
                        <tr key={idx}>
                            <td style={{ ...styles.td, textAlign: 'center', fontWeight: 'bold', background: '#c00000', color: '#fff' }}>{adv.advisor}</td>
                            <td style={styles.td}>{fmtNum(cuotaSugerida / 2)}</td>
                            <td style={{ ...styles.td, fontWeight: 'bold' }}>{fmtNum(adv.realData.venta)}</td>
                            <td style={styles.td}>{fmtNum(adv.realData.igv)}</td>
                            <td style={styles.td}>{fmtNum(adv.realData.base)}</td>
                            <td style={styles.td}>{fmtNum(adv.realData.renta)}</td>
                            <td style={styles.td}>{fmtNum(adv.realData.openPay)}</td>
                            <td style={{ ...styles.td, fontWeight: 'bold' }}>{fmtNum(adv.realData.ventasNetas)}</td>
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
                            <td style={{ ...styles.td, background: '#c00000', fontWeight: 'bold', color: '#fff' }}>{fmtNum(adv.realData.totalComision)}</td>
                        </tr>
                    ))}
                    <tr style={{ background: '#c00000', fontWeight: 'bold', color: '#fff' }}>
                        <td style={{ ...styles.td, textAlign: 'center', color: '#fff' }}>TOTAL</td>
                        <td style={{ ...styles.td, color: '#fff' }}>{fmtNum(cuotaSugerida)}</td>
                        <td style={{ ...styles.td, color: '#fff' }}>{fmtNum(commissionData.reduce((acc, a) => acc + a.realData.venta, 0))}</td>
                        <td style={{ ...styles.td, color: '#fff' }}>{fmtNum(commissionData.reduce((acc, a) => acc + a.realData.igv, 0))}</td>
                        <td style={{ ...styles.td, color: '#fff' }}>{fmtNum(commissionData.reduce((acc, a) => acc + a.realData.base, 0))}</td>
                        <td style={{ ...styles.td, color: '#fff' }}>{fmtNum(commissionData.reduce((acc, a) => acc + a.realData.renta, 0))}</td>
                        <td style={{ ...styles.td, color: '#fff' }}>{fmtNum(commissionData.reduce((acc, a) => acc + a.realData.openPay, 0))}</td>
                        <td style={{ ...styles.td, color: '#fff' }}>{fmtNum(commissionData.reduce((acc, a) => acc + a.realData.ventasNetas, 0))}</td>
                        <td style={{ ...styles.td, color: '#fff' }}>-</td>
                        <td style={{ ...styles.td, color: '#fff' }}>-</td>
                        <td className='text-white' style={{ ...styles.td, fontSize: '22px', color: '#fff' }}>
                            {fmtNum(commissionData.reduce((acc, a) => acc + a.realData.totalComision, 0))}
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
                                <td style={styles.td}><strong>{fmtNum(row.data.venta)}</strong></td>
                                <td style={{ ...styles.td, color: '#666' }}>{fmtNum(row.data.igv)}</td>
                                <td style={styles.td}>{fmtNum(row.data.base)}</td>
                                <td style={styles.td}>{fmtNum(row.data.renta)}</td>
                                <td style={styles.td}>{fmtNum(row.data.openPay)}</td>
                                <td style={styles.td}><strong>{fmtNum(row.data.ventasNetas)}</strong></td>
                                <td style={{ ...styles.td, background: '#e8f5e9', textAlign: 'center' }}>
                                    <input type="number" step="0.1" value={row.com} onChange={(e) => updateScaleCommission(row.index, e.target.value)} style={styles.inputCom} /> %
                                </td>
                                <td style={{ ...styles.td, fontWeight: 'bold' }}>{fmtNum(row.data.importeComision)}</td>
                                <td style={{ ...styles.td, fontWeight: 'bold' }}>{fmtNum(row.data.totalComision)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <Button variant="success" size="sm" className="mb-4" onClick={addScaleRow}>+ Escala</Button>

            {/* --- SECCIÓN POR VENDEDOR --- */}
            {
                commissionData.map(adv => (
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
                                        <td style={{ ...styles.td, background: '#ccc' }}><strong>{fmtNum(row.venta)}</strong></td>
                                        <td style={styles.td}>{fmtNum(row.igv)}</td>
                                        <td style={styles.td}>{fmtNum(row.base)}</td>
                                        <td style={styles.td}>{fmtNum(row.renta)}</td>
                                        <td style={styles.td}>{fmtNum(row.openPay)}</td>
                                        <td style={styles.td}><strong>{fmtNum(row.ventasNetas)}</strong></td>
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
                                        <td style={styles.td}>{fmtNum(row.importeComision)}</td>
                                        <td style={{ ...styles.td, fontWeight: 'bold', border: '2px solid #000' }}>{fmtNum(row.totalComision)}</td>
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
                                        <td style={{ ...styles.td, fontWeight: 'bold' }}>{fmtNum(row.venta)}</td>
                                        <td style={styles.td}>{fmtNum(row.igv)}</td>
                                        <td style={{ ...styles.td, fontWeight: 'bold' }}>{fmtNum(row.base)}</td>
                                        <td style={styles.td}>{fmtNum(row.renta)}</td>
                                        <td style={styles.td}>{fmtNum(row.openPay)}</td>
                                        <td style={{ ...styles.td, fontWeight: 'bold' }}>{fmtNum(row.ventasNetas)}</td>
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
                                        <td style={{ ...styles.td, fontWeight: 'bold' }}>{fmtNum(row.importeComision)}</td>
                                        <td style={{ ...styles.td, fontWeight: 'bold', border: '2px solid #000' }}>{fmtNum(row.totalComision)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))
            }
        </div >
    );
};