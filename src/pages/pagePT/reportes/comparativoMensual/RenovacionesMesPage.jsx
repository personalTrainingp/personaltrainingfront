import { MESES } from '../resumenEjecutivo/hooks/useResumenUtils';
import { useState } from 'react';
import { Form, Row, Col, Card } from 'react-bootstrap';
import { useResumenEjecutivoStore } from '../resumenEjecutivo/useResumenEjecutivoStore';
import { useComparativoMensualLogic } from './hooks/useComparativoMensualLogic';
import { RenovationsBreakdownTable } from './components/RenovationsBreakdownTable';
import { PageBreadcrumb } from '@/components';

const RenovacionesMesPage = () => {
    const {
        dataVentas,
        loading,
        year, setYear,
        selectedMonth, setSelectedMonth,
        cutDay, setCutDay, setInitDay
    } = useResumenEjecutivoStore();

    const [customStartDay, setCustomStartDay] = useState(1);
    const [customEndDay, setCustomEndDay] = useState(new Date().getDate());

    const handleStartDayChange = (val) => { setCustomStartDay(val); setInitDay(val); };
    const handleEndDayChange = (val) => { setCustomEndDay(val); setCutDay(val); };

    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = 2024; y <= currentYear + 1; y++) years.push(y);

    // monthsData necesario para RenovationsBreakdownTable (define las columnas de meses)
    const { monthsData } = useComparativoMensualLogic({
        ventas: dataVentas,
        year: Number(year),
        startMonth: Number(selectedMonth) - 1,
        cutDay,
        customStartDay,
        customEndDay,
    });

    return (
        <>
            <PageBreadcrumb title={'Cantidad de Socios y Montos'} subName={'Renovaciones por Mes'} />
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="mb-4 align-items-end">
                                <Col md={5} lg={4}>
                                    <div className="d-flex gap-3 align-items-end">
                                        <Form.Group style={{ width: '200px' }}>
                                            <Form.Label className="fw-bold text-muted" style={{ fontSize: '18px', marginBottom: '5px' }}>AÑO</Form.Label>
                                            <Form.Select
                                                value={year}
                                                onChange={(e) => setYear(Number(e.target.value))}
                                                style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '28px' }}
                                            >
                                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                                            </Form.Select>
                                        </Form.Group>

                                        <Form.Group style={{ width: '250px', fontSize: '20px' }}>
                                            <Form.Label className="fw-bold text-muted" style={{ fontSize: '18px', marginBottom: '5px' }}>INICIAR DESDE</Form.Label>
                                            <Form.Select
                                                value={selectedMonth}
                                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                                style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '28px' }}
                                            >
                                                {MESES.map((mes, idx) => (
                                                    <option key={idx} value={idx + 1}>{mes.toUpperCase()}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </div>
                                </Col>

                                <Col md={4} lg={4}>
                                    <div className="d-flex gap-2 align-items-end justify-content-center">
                                        <Form.Group style={{ width: '100px' }}>
                                            <Form.Label className="fw-bold text-muted" style={{ fontSize: '18px', marginBottom: '5px' }}>INICIO</Form.Label>
                                            <Form.Select value={customStartDay} onChange={(e) => handleStartDayChange(Number(e.target.value))} style={{ fontWeight: 'bold', fontSize: '25px' }}>
                                                {Array.from({ length: 31 }, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}</option>)}
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group style={{ width: '100px' }}>
                                            <Form.Label className="fw-bold text-muted" style={{ fontSize: '18px', marginBottom: '5px' }}>CORTE</Form.Label>
                                            <Form.Select value={customEndDay} onChange={(e) => handleEndDayChange(Number(e.target.value))} style={{ fontWeight: 'bold', fontSize: '25px' }}>
                                                {Array.from({ length: 31 }, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}</option>)}
                                            </Form.Select>
                                        </Form.Group>
                                    </div>
                                </Col>
                            </Row>

                            {loading ? (
                                <div className="text-center p-5">
                                    <div className="spinner-border text-danger" role="status">
                                        <span className="visually-hidden">Cargando...</span>
                                    </div>
                                </div>
                            ) : (
                                <RenovationsBreakdownTable
                                    ventas={dataVentas}
                                    monthsData={monthsData}
                                />
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default RenovacionesMesPage;
