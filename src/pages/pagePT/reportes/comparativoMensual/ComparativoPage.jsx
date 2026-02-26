import { MESES } from '../resumenEjecutivo/hooks/useResumenUtils';
import { useState } from 'react';
import { Form, Row, Col, Card } from 'react-bootstrap';
import { useResumenEjecutivoStore } from '../resumenEjecutivo/useResumenEjecutivoStore';
import { ComparativoMensualTable } from './components/ComparativoMensualTable';
import { PageBreadcrumb } from '@/components';

const ComparativoPage = () => {
    const {
        dataVentas,
        loading,
        year, setYear,
        selectedMonth, setSelectedMonth,
        cutDay, setCutDay, setInitDay
    } = useResumenEjecutivoStore();

    const [customStartDay, setCustomStartDay] = useState(1);
    const [customEndDay, setCustomEndDay] = useState(new Date().getDate());

    const handleStartDayChange = (val) => {
        setCustomStartDay(val);
        setInitDay(val);
    };

    const handleEndDayChange = (val) => {
        setCustomEndDay(val);
        setCutDay(val);
    };

    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = 2024; y <= currentYear + 1; y++) years.push(y);

    // Calcular hookYear y hookStartMonth retrocediendo 5 meses desde el mes seleccionado
    // Para que el hook incluya los 6 meses anteriores al mes elegido (e.g. Jan→ empieza desde Ago)
    const absStart = Number(year) * 12 + (Number(selectedMonth) - 1) - 5;
    const hookYear = Math.floor(absStart / 12);
    const hookStartMonth = absStart - hookYear * 12;

    return (
        <>
            <PageBreadcrumb title={'Asesores'} subName={'Ventas por Asesor'} />
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
                                            <Form.Select
                                                value={customStartDay}
                                                onChange={(e) => handleStartDayChange(Number(e.target.value))}
                                                style={{ fontWeight: 'bold', fontSize: '25px' }}
                                            >
                                                {Array.from({ length: 31 }, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}</option>)}
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group style={{ width: '100px' }}>
                                            <Form.Label className="fw-bold text-muted" style={{ fontSize: '18px', marginBottom: '5px' }}>CORTE</Form.Label>
                                            <Form.Select
                                                value={customEndDay}
                                                onChange={(e) => handleEndDayChange(Number(e.target.value))}
                                                style={{ fontWeight: 'bold', fontSize: '25px' }}
                                            >
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
                                <ComparativoMensualTable
                                    ventas={dataVentas}
                                    year={hookYear}
                                    startMonth={hookStartMonth}
                                    cutDay={cutDay}
                                    title="TOTAL VENTAS MEMBRESIAS"
                                    customStartDay={customStartDay}
                                    customEndDay={customEndDay}
                                    displayYear={Number(year)}
                                    displayStartMonth={Number(selectedMonth) - 1}
                                />
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default ComparativoPage;
