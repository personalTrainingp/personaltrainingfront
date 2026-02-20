import { MESES } from '../resumenEjecutivo/hooks/useResumenUtils';
import { useState } from 'react';
import { Form, Row, Col, Card, Button, ButtonGroup } from 'react-bootstrap';
import { useResumenEjecutivoStore } from '../resumenEjecutivo/useResumenEjecutivoStore';
import { ComparativoMensualTable } from './components/ComparativoMensualTable';
import { MetaAlcanceTable } from './components/MetaAlcanceTable';
import { ComisionesTable } from './components/ComisionesTable';
import { PageBreadcrumb } from '@/components';

const App = () => {
    const {
        dataVentas,
        loading,
        year, setYear,
        selectedMonth, setSelectedMonth, // Usamos el estado global del store
        cutDay
    } = useResumenEjecutivoStore();

    // 'standard', 'goals', 'commissions'
    const [viewMode, setViewMode] = useState('standard');

    // Custom Range State
    const [customStartDay, setCustomStartDay] = useState(1);
    const [customEndDay, setCustomEndDay] = useState(15);

    // Generamos lista de años empezando desde 2024
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = 2024; y <= currentYear + 1; y++) {
        years.push(y);
    }

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
                                            <Form.Label className="fw-bold text-muted" style={{ fontSize: '18px', marginBottom: '5px' }}>AÑO</Form.Label>
                                            <Form.Select
                                                value={year}
                                                onChange={(e) => setYear(Number(e.target.value))}
                                                style={{
                                                    fontWeight: 'bold',
                                                    textTransform: 'uppercase',
                                                    fontSize: '28px'
                                                }}
                                            >
                                                {years.map(y => (
                                                    <option key={y} value={y}>{y}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>

                                        {/* 2. SELECTOR MES (Ocupa el resto) */}
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

                                {/* 3. SELECTORES DE RANGO PERSONALIZADO (NUEVO) */}
                                <Col md={4} lg={4}>
                                    <div className="d-flex gap-2 align-items-end justify-content-center">
                                        <Form.Group style={{ width: '100px', fontSize: '20px' }}>
                                            <Form.Label className="fw-bold text-muted" style={{ fontSize: '18px', marginBottom: '5px' }}>DIA INICIO</Form.Label>
                                            <Form.Select
                                                value={customStartDay}
                                                onChange={(e) => setCustomStartDay(Number(e.target.value))}
                                                style={{ fontWeight: 'bold', fontSize: '25px' }}
                                            >
                                                {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                                                    <option key={d} value={d}>{d}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                        <span style={{ fontSize: '24px', fontWeight: 'bold', paddingBottom: '5px' }}>-</span>
                                        <Form.Group style={{ width: '100px', fontSize: '25px' }}>
                                            <Form.Label className="fw-bold text-muted" style={{ fontSize: '18px', marginBottom: '5px' }}>DIA CORTE</Form.Label>
                                            <Form.Select
                                                value={customEndDay}
                                                onChange={(e) => setCustomEndDay(Number(e.target.value))}
                                                style={{ fontWeight: 'bold', fontSize: '25px' }}
                                            >
                                                {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                                                    <option key={d} value={d}>{d}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </div>
                                </Col>
                                <Col className="text-end">
                                    <ButtonGroup>
                                        <Button
                                            variant={viewMode === 'standard' ? "primary" : "outline-primary"}
                                            onClick={() => setViewMode('standard')}
                                        >
                                            VER TABLAS
                                        </Button>
                                        <Button
                                            variant={viewMode === 'goals' ? "primary" : "outline-primary"}
                                            onClick={() => setViewMode('goals')}
                                        >
                                            VER METAS
                                        </Button>
                                        <Button
                                            variant={viewMode === 'commissions' ? "primary" : "outline-primary"}
                                            onClick={() => setViewMode('commissions')}
                                        >
                                            COMISIONES
                                        </Button>
                                    </ButtonGroup>
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
                                    {viewMode === 'goals' && (
                                        <MetaAlcanceTable
                                            ventas={dataVentas}
                                            year={year}
                                            startMonth={selectedMonth - 1}
                                            cutDay={cutDay}
                                            customStartDay={customStartDay}
                                            customEndDay={customEndDay}
                                        />
                                    )}

                                    {viewMode === 'commissions' && (
                                        <ComisionesTable
                                            ventas={dataVentas}
                                            year={year}
                                            month={selectedMonth}
                                        />
                                    )}

                                    {viewMode === 'standard' && (
                                        <>
                                            <ComparativoMensualTable
                                                ventas={dataVentas}
                                                year={year}
                                                startMonth={selectedMonth - 1}
                                                cutDay={cutDay}
                                                title="TOTAL VENTAS"
                                                customStartDay={customStartDay}
                                                customEndDay={customEndDay}
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
                                                customStartDay={customStartDay}
                                                customEndDay={customEndDay}
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