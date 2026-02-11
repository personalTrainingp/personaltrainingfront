import { MESES } from '../resumenEjecutivo/hooks/useResumenUtils';
import { useState } from 'react';
import { Form, Row, Col, Card, Button } from 'react-bootstrap';
import { useResumenEjecutivoStore } from '../resumenEjecutivo/useResumenEjecutivoStore';
import { ComparativoMensualTable } from './components/ComparativoMensualTable';
import { MetaAlcanceTable } from './components/MetaAlcanceTable';
import { PageBreadcrumb } from '@/components';

const App = () => {
    const {
        dataVentas,
        loading,
        year, setYear,
        selectedMonth, setSelectedMonth, // Usamos el estado global del store
        cutDay
    } = useResumenEjecutivoStore();

    const [showGoalView, setShowGoalView] = useState(false);

    // Generamos lista de años (ej: actual -1 a actual +3)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 1 + i);

    return (
        <>
            <PageBreadcrumb title={'Reportes'} subName={'Comparativo Mensual'} />
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="mb-4 align-items-end">
                                {/* Columna contenedora de controles */}
                                <Col md={5} lg={4}>
                                    <div className="d-flex gap-3 align-items-end">

                                        {/* 1. SELECTOR AÑO (Reducido a la mitad aprox) */}
                                        <Form.Group style={{ width: '200px' }}>
                                            <Form.Label className="fw-bold text-muted" style={{ fontSize: '16px', marginBottom: '5px' }}>AÑO</Form.Label>
                                            <Form.Select
                                                value={year}
                                                onChange={(e) => setYear(Number(e.target.value))}
                                                style={{
                                                    fontWeight: 'bold',
                                                    textTransform: 'uppercase',
                                                    fontSize: '25px'
                                                }}
                                            >
                                                {years.map(y => (
                                                    <option key={y} value={y}>{y}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>

                                        {/* 2. SELECTOR MES (Ocupa el resto) */}
                                        <Form.Group style={{ width: '250px', fontSize: '20px' }}>
                                            <Form.Label className="fw-bold text-muted" style={{ fontSize: '16px', marginBottom: '5px' }}>INICIAR DESDE</Form.Label>
                                            <Form.Select
                                                value={selectedMonth}
                                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                                style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '25px' }}
                                            >
                                                {MESES.map((mes, idx) => (
                                                    <option key={idx} value={idx + 1}>{mes.toUpperCase()}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </div>
                                </Col>
                                <Col className="text-end">
                                    <Button
                                        variant={showGoalView ? "outline-primary" : "primary"}
                                        onClick={() => setShowGoalView(!showGoalView)}
                                    >
                                        {showGoalView ? "VER TABLAS DETALLADAS" : "VER COMPARATIVO METAS"}
                                    </Button>
                                </Col>
                            </Row>

                            {loading ? (
                                <div className="text-center p-5">
                                    <div className="spinner-border text-danger" role="status">
                                        <span className="visually-hidden">Cargando...</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {showGoalView ? (
                                        <MetaAlcanceTable
                                            ventas={dataVentas}
                                            year={year}
                                            startMonth={selectedMonth - 1}
                                            cutDay={cutDay}
                                        />
                                    ) : (
                                        <>
                                            <ComparativoMensualTable
                                                ventas={dataVentas}
                                                year={year}
                                                startMonth={selectedMonth - 1}
                                                cutDay={cutDay}
                                                title="TOTAL VENTAS"
                                            />

                                            <hr className="my-5" />

                                            <ComparativoMensualTable
                                                ventas={dataVentas.filter(v => v.id_origen === 691)}
                                                year={year}
                                                startMonth={selectedMonth - 1}
                                                cutDay={cutDay}
                                                title="RENOVACIONES"
                                                showFortnightly={true}
                                                variant="renovations"
                                            />
                                        </>
                                    )}
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default App;