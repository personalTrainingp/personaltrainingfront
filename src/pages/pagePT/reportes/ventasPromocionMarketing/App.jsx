import React, { useState } from 'react';
import { Card, Row, Col, Form } from 'react-bootstrap';
import { PageBreadcrumb } from '@/components';

const VentasPromocionMarketing = () => {
    const [mes, setMes] = useState(1);
    const [anio, setAnio] = useState(new Date().getFullYear());

    return (
        <>
            <PageBreadcrumb title={'Ventas realizadas segun promoción de marketing'} />

            <Row>
                <Col xl={12}>
                    <Card>
                        <Card.Body>
                            <Row className="mb-4">
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label>Año</Form.Label>
                                        <Form.Select value={anio} onChange={(e) => setAnio(e.target.value)}>
                                            {[2023, 2024, 2025, 2026, 2027].map(y => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label>Mes</Form.Label>
                                        <Form.Select value={mes} onChange={(e) => setMes(e.target.value)}>
                                            {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map((m, i) => (
                                                <option key={i} value={i + 1}>{m}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <hr />

                            <div className="text-center p-5">
                                <h4>Sección en construcción...</h4>
                                <p className="text-muted mt-3">Aquí se mostrarán las métricas de ventas y cantidad de socios por campaña de marketing.</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default VentasPromocionMarketing;
