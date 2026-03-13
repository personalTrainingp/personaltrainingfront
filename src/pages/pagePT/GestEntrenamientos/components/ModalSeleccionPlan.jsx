import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Card } from 'react-bootstrap';

const ModalSeleccionPlan = ({ show, handleClose, planOptions, onSave, saving }) => {
    const [selectedPlanId, setSelectedPlanId] = useState(null);

    const handleSubmit = () => {
        if (selectedPlanId) {
            onSave(selectedPlanId);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="bi bi-journal-check me-2 text-primary"></i>
                    Seleccionar Plan de Entrenamiento
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                <p className="text-muted mb-3">
                    Selecciona el plan que deseas asignar al socio. Esto determinará la duración y cantidad de sesiones.
                </p>

                <Row className="g-3">
                    {planOptions && planOptions.map((plan) => (
                        <Col md={6} key={plan.id || plan.value}>
                            <Card
                                className={`h-100 cursor-pointer ${selectedPlanId === (plan.id || plan.value) ? 'border-primary bg-light' : ''}`}
                                onClick={() => setSelectedPlanId(plan.id || plan.value)}
                                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                            >
                                <Card.Body className="d-flex align-items-center">
                                    <Form.Check
                                        type="radio"
                                        name="planSelection"
                                        id={`plan-${plan.id || plan.value}`}
                                        checked={selectedPlanId === (plan.id || plan.value)}
                                        onChange={() => setSelectedPlanId(plan.id || plan.value)}
                                        className="me-3"
                                        style={{ transform: 'scale(1.2)' }}
                                    />
                                    <div>
                                        <h6 className="mb-0 fw-bold">{plan.label}</h6>
                                        {/* Optional details if available in plan object */}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {!planOptions || planOptions.length === 0 && (
                    <div className="text-center py-4 text-muted">
                        No hay planes disponibles.
                    </div>
                )}

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} disabled={saving}>
                    Cancelar
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={!selectedPlanId || saving}
                >
                    {saving ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Guardando...
                        </>
                    ) : (
                        'Guardar Selección'
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
export default ModalSeleccionPlan;
