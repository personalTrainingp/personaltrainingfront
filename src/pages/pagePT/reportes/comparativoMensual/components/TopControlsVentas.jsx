import { MESES, getDaysInMonth } from '../../resumenEjecutivo/hooks/useResumenUtils';
import { Form, Row, Col, Button, ButtonGroup } from 'react-bootstrap';

export const TopControlsVentas = ({
    year, setYear,
    selectedMonth, setSelectedMonth,
    customStartDay, handleStartDayChange,
    customEndDay, handleEndDayChange,
    viewMode, setViewMode,
    showViewButtons = true
}) => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = 2024; y <= currentYear + 1; y++) {
        years.push(y);
    }

    const maxDays = getDaysInMonth(selectedMonth, year);

    return (
        <Row className="mb-4 align-items-end">
            {/* Columna contenedora de controles */}
            <Col md={5} lg={4}>
                <div className="d-flex gap-3 align-items-end">

                    {/* 1. SELECTOR AÑO */}
                    <Form.Group style={{ width: '200px' }}>
                        <Form.Label className="fw-bold text-muted" style={{ fontSize: '18px', marginBottom: '5px' }}>AÑO</Form.Label>
                        <Form.Select
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '28px' }}
                        >
                            {years.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {/* 2. SELECTOR MES */}
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

            {/* 3. SELECTORES DE RANGO PERSONALIZADO */}
            <Col md={4} lg={4}>
                <div className="d-flex gap-2 align-items-end justify-content-center">
                    <Form.Group style={{ width: '100px', fontSize: '20px' }}>
                        <Form.Label className="fw-bold text-muted" style={{ fontSize: '18px', marginBottom: '5px' }}> INICIO</Form.Label>
                        <Form.Select
                            value={customStartDay}
                            onChange={(e) => handleStartDayChange(Number(e.target.value))}
                            style={{ fontWeight: 'bold', fontSize: '25px' }}
                        >
                            {Array.from({ length: maxDays }, (_, i) => i + 1).map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <span style={{ fontSize: '24px', fontWeight: 'bold', paddingBottom: '5px' }}></span>
                    <Form.Group style={{ width: '100px', fontSize: '25px' }}>
                        <Form.Label className="fw-bold text-muted" style={{ fontSize: '18px', marginBottom: '5px' }}> CORTE</Form.Label>
                        <Form.Select
                            value={customEndDay}
                            onChange={(e) => handleEndDayChange(Number(e.target.value))}
                            style={{ fontWeight: 'bold', fontSize: '25px' }}
                        >
                            {Array.from({ length: maxDays }, (_, i) => i + 1).map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </div>
            </Col>

            {/* 4. BOTONES DE VISTA */}
            {showViewButtons && (
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
                    </ButtonGroup>
                </Col>
            )}
        </Row>
    );
};
