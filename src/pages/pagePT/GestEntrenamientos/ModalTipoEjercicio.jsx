import React from 'react';
import { Modal, Button, Form, Spinner, Row, Col, Card } from 'react-bootstrap';
import { useModalTipoEjercicioLogic } from './hooks/useModalTipoEjercicioLogic';

export function ModalTipoEjercicio({ show, onHide, onSaved }) {
    const {
        nombre, setNombre,
        usaPeso, setUsaPeso,
        usaTiempo, setUsaTiempo,
        loading,
        handleSave
    } = useModalTipoEjercicioLogic({ show, onHide, onSaved });

    const OptionCard = ({ label, icon, checked, onChange, colorClass }) => (
        <Card
            className={`h-100 cursor-pointer transition-all ${checked ? `border-${colorClass} bg-${colorClass} bg-opacity-10` : 'border-light bg-light'}`}
            style={{ cursor: 'pointer', transition: '0.2s all' }}
            onClick={() => onChange(!checked)}
        >
            <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center p-3">
                <div className={`rounded-circle p-3 mb-2 ${checked ? `bg-${colorClass} text-white` : 'bg-white text-muted shadow-sm'}`}>
                    <i className={`bi ${icon} fs-4`}></i>
                </div>
                <h6 className={`fw-bold mb-1 ${checked ? `text-${colorClass}` : 'text-muted'}`}>{label}</h6>
                <div className="form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={checked}
                        onChange={() => { }} // Manejado por el onClick del Card
                        style={{ pointerEvents: 'none' }}
                    />
                </div>
            </Card.Body>
        </Card>
    );

    return (
        <Modal show={show} onHide={onHide} centered size="md">
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="h5 fw-bold">Crear Nueva Categoría</Modal.Title>
            </Modal.Header>

            <Modal.Body className="pt-2 pb-4 px-4">
                <p className="text-muted small mb-4">
                    Define las reglas para este grupo de entrenamientos.
                </p>

                <Form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                    <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">Nombre de la Categoría</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ej: Piernas,Brazos, Yoga, CrossFit..."
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            autoFocus
                            className="form-control-lg"
                        />
                    </Form.Group>

                    <Form.Label className="fw-bold mb-3">¿Qué métricas registras?</Form.Label>
                    <Row className="g-3 mb-4">
                        <Col xs={6}>
                            <OptionCard
                                label="Usa Peso / Cargas"
                                icon="bi-barbell" // Icono de pesas
                                checked={usaPeso}
                                onChange={setUsaPeso}
                                colorClass="primary"
                            />
                        </Col>
                        <Col xs={6}>
                            <OptionCard
                                label="Usa Tiempo / Duración"
                                icon="bi-stopwatch" // Icono de cronómetro
                                checked={usaTiempo}
                                onChange={setUsaTiempo}
                                colorClass="success" // Color verde para tiempo
                            />
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="light" onClick={onHide}>Cancelar</Button>
                        <Button variant="dark" onClick={handleSave} disabled={loading} className="px-4">
                            {loading ? <Spinner size="sm" animation="border" /> : 'Crear Categoría'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}