import { DateMask, NumberFormatMoney } from '@/components/CurrencyMask'
import React, { useEffect } from 'react'
import { Table, Card, Row, Col, Container } from 'react-bootstrap' // Asegúrate de importar Card, Row, Col
import { useGestionLeadStore } from './useGestionLeadStore'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { Button } from 'primereact/button'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { Tag } from 'primereact/tag' // Opcional para etiquetas de redes

dayjs.extend(utc)

export const TableGestionLead = ({ onClickCustomLead, onDeleteItemLead, id_empresa = 598 }) => {
    const { obtenerLeads } = useGestionLeadStore()
    const {
        DataGeneral: dataRedesInvertidas,
        obtenerParametroPorEntidadyGrupo: obtenerRedesInvertidas,
        obtenerTipoCambio: fetchTC,
        usdPenRate: rateState,
        FALLBACK_USD_PEN_RATE: fallbackRate,
        calcularTotalesLeads
    } = useTerminoStore();
    const { dataView } = useSelector(e => e.DATA)

    useEffect(() => {
        obtenerLeads(id_empresa)
        obtenerRedesInvertidas('inversion', 'redes')
        fetchTC();
    }, [])

    const {
        igvMetaUSD,
        igvTikTokPEN,
        totalIGVSoles,
        totalMontoSoles,
        totalBaseSoles,
        TASA_CAMBIO
    } = calcularTotalesLeads(dataView, rateState, fallbackRate);

    // Componente auxiliar para celdas de dinero
    const MoneyCell = ({ symbol, amount, isTotal = false }) => (
        <div className={`d-flex justify-content-end align-items-center ${isTotal ? 'fw-bold' : ''}`}>
            <span className="text-muted mr-1" style={{ fontSize: '1em', width: '25px' }}>{symbol}</span>
            <span className={isTotal ? 'text-dark' : 'text-secondary'}>
                <NumberFormatMoney amount={amount} />
            </span>
        </div>
    );

    return (
        <Container fluid className="p-0 fade-in">
            {/* --- SECCIÓN DE RESUMEN (KPIs) --- */}
            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h4 className="m-0 font-weight-bold text-dark">Gestión de Leads</h4>
                        <p className="text-muted small mb-0">Administra la inversión publicitaria mensual</p>
                    </div>
                    <Button
                        label='NUEVO LEAD'
                        icon="pi pi-plus"
                        className="p-button-raised p-button-primary"
                        onClick={() => onClickCustomLead(0, id_empresa, {})}
                    />
                </div>

                <Row className="g-3">
                    <Col md={3}>
                        <Card className="border-0 shadow-sm h-100 border-left-tiktok"> {/* Clase CSS sugerida abajo */}
                            <Card.Body>
                                <div className="text-uppercase text-muted small fw-bold mb-1">IGV TikTok</div>
                                <div className="h4 mb-0 fw-bold text-dark">
                                    <small className="text-muted fs-6 mr-1">S/.</small>
                                    <NumberFormatMoney amount={igvTikTokPEN} />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="border-0 shadow-sm h-100 border-left-meta">
                            <Card.Body>
                                <div className="text-uppercase text-muted small fw-bold mb-1">IGV Meta</div>
                                <div className="h4 mb-0 fw-bold text-dark">
                                    <small className="text-muted fs-6 mr-1">$</small>
                                    <NumberFormatMoney amount={igvMetaUSD} />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className="border-0 shadow-sm h-100 bg-white">
                            <Card.Body className="d-flex align-items-center justify-content-between">
                                <div>
                                    <div className="text-uppercase text-danger small fw-bold mb-1">Total IGV (Soles)</div>
                                    <div className="h3 mb-0 fw-bold text-danger">
                                        <small className="text-muted fs-5 mr-1">S/.</small>
                                        <NumberFormatMoney amount={totalIGVSoles} />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Tag severity="info" value={`TC: ${TASA_CAMBIO.toFixed(3)}`} rounded></Tag>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* --- SECCIÓN DE TABLA --- */}
            <Card className="border-0 shadow-sm rounded-lg overflow-hidden">
                <div className="table-responsive">
                    <Table hover className="align-middle mb-0" style={{ minWidth: '1000px' }}>
                        <thead className="bg-primary">
                            <tr style={{ fontSize: '1rem' }}>
                                <th className="text-white text-uppercase  border-0 py-3 pl-4 ">Fecha</th>
                                <th className="text-white text-uppercase  border-0 py-3">Red</th>
                                <th className="text-white text-uppercase  border-0 py-3 text-center">Cantidad</th>
                                <th className="text-white text-uppercase  border-0 py-3 text-right">Costo Lead<br /><small>(Sin IGV)</small></th>
                                <th className="text-white text-uppercase  border-0 py-3 text-right">Costo Lead<br /><small>(Con IGV)</small></th>
                                <th className="text-white text-uppercase  border-0 py-3 text-right">Invertido<br /><small>(Sin IGV)</small></th>
                                <th className="text-white text-uppercase  border-0 py-3 text-right">Invertido<br /><small>(Con IGV)</small></th>
                                <th className="text-white text-uppercase  border-0 py-3 text-right">IGV (18%)</th>
                                <th className="text-white text-uppercase  border-0 py-3 text-center" style={{ width: '100px' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataView?.map(m => {
                                const nombreRed = dataRedesInvertidas.find(d => d.value === m.id_red)?.label || '';
                                const simbolo = nombreRed === 'META ADS' ? '$' : 'S/.';
                                const montoTotal = m.monto || 0;
                                const montoBase = montoTotal / 1.18;
                                const igv = montoTotal - montoBase;
                                const cant = m.cantidad || 1;

                                return (
                                    <tr key={m.id} className="border-bottom" style={{ fontSize: '1.1rem' }}>
                                        <td className="pl-4 font-weight-bold text-dark">
                                            <div>{dayjs.utc(m.fecha).format('dddd').toUpperCase()}</div>
                                            <div>{dayjs.utc(m.fecha).format('DD [DE] MMMM [DEL] YYYY').toUpperCase()}</div>
                                        </td>
                                        <td>
                                            {nombreRed === 'META ADS'
                                                ? <Tag severity="info" value="Meta Ads" />
                                                : <Tag severity="warning" style={{ backgroundColor: 'black', color: 'white' }} value="TikTok Ads" />
                                            }
                                        </td>
                                        <td className="text-center">
                                            <span className="badge bg-light text-dark" style={{ fontSize: '1.1rem' }}>{m.cantidad}</span>
                                        </td>
                                        {/* Celdas monetarias usando el componente auxiliar */}
                                        <td><MoneyCell symbol={simbolo} amount={montoBase / cant} /></td>
                                        <td><MoneyCell symbol={simbolo} amount={montoTotal / cant} /></td>
                                        <td><MoneyCell symbol={simbolo} amount={montoBase} /></td>
                                        <td className="bg-light-yellow"><MoneyCell symbol={simbolo} amount={montoTotal} isTotal /></td>

                                        <td>
                                            <div className="d-flex justify-content-end align-items-center text-danger font-weight-bold">
                                                <span className="mr-1" style={{ fontSize: '0.85em' }}>{simbolo}</span>
                                                <NumberFormatMoney amount={igv} />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex justify-content-center gap-2">
                                                <Button
                                                    icon="pi pi-pencil"
                                                    className="p-button-rounded p-button-text p-button-secondary p-button-sm"
                                                    onClick={() => onClickCustomLead(m?.id, id_empresa, { fecha: dayjs.utc(m.fecha).format('YYYY-MM-DD'), cantidad: m.cantidad, monto: m.monto, id_red: m.id_red })}
                                                />
                                                <Button
                                                    icon="pi pi-trash"
                                                    className="p-button-rounded p-button-text p-button-danger p-button-sm"
                                                    onClick={() => onDeleteItemLead(m?.id, id_empresa)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                            {(!dataView || dataView.length === 0) && (
                                <tr>
                                    <td colSpan="9" className="text-center py-5 text-muted">
                                        <i className="pi pi-inbox mb-2" style={{ fontSize: '2rem' }}></i>
                                        <div>No hay leads registrados este mes</div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot className="bg-white border-top-2">
                            <tr>
                                <td colSpan={5} className="text-right text-uppercase small text-muted font-weight-bold py-3">Totales Consolidados (S/.):</td>
                                <td className="py-3"><MoneyCell symbol="S/." amount={totalBaseSoles} isTotal /></td>
                                <td className="py-3"><MoneyCell symbol="S/." amount={totalMontoSoles} isTotal /></td>
                                <td className="py-3 text-danger"><MoneyCell symbol="S/." amount={totalIGVSoles} isTotal /></td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </Table>
                </div>
            </Card>
        </Container>
    )
}