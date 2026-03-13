import React from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { useModalCrearTurnoLogic } from './hooks/useModalCrearTurnoLogic';

export function ModalCrearTurno({ show, onHide, onSaved, turnoToEdit = null }) {
    const {
        nombre, setNombre,
        horaInicio, setHoraInicio,
        horaFin, setHoraFin,
        saving,
        error,
        handleSubmit
    } = useModalCrearTurnoLogic({ show, onHide, onSaved, turnoToEdit });

    return (
        <Modal show={show} onHide={onHide} centered fullscreen="md-down">
            <Modal.Header closeButton>
                <Modal.Title>{turnoToEdit ? 'Editar Turno' : 'Crear Nuevo Turno'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre del Turno *</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ej: Primer Turno Mañana"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <div className="d-flex gap-2">
                        <Form.Group className="mb-3 flex-fill">
                            <Form.Label>Hora Inicio</Form.Label>
                            <Form.Control
                                type="time"
                                value={horaInicio}
                                onChange={e => setHoraInicio(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 flex-fill">
                            <Form.Label>Hora Fin</Form.Label>
                            <Form.Control
                                type="time"
                                value={horaFin}
                                onChange={e => setHoraFin(e.target.value)}
                            />
                        </Form.Group>
                    </div>
                    <div className="d-flex justify-content-end gap-2 mt-2">
                        <Button variant="secondary" onClick={onHide}>Cancelar</Button>
                        <Button type="submit" variant="success" disabled={saving}>
                            {saving ? <><Spinner size="sm" /> Guardando...</> : (turnoToEdit ? 'Actualizar' : 'Crear Turno')}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
