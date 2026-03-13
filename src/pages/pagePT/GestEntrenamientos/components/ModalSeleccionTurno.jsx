import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';

export function ModalSeleccionTurno({ show, onHide, onSave, turnos, saving }) {
    const [selectedTurnoId, setSelectedTurnoId] = useState('');

    useEffect(() => {
        if (!show) {
            setSelectedTurnoId('');
        }
    }, [show]);

    const handleConfirm = () => {
        if (!selectedTurnoId) return;
        const selectedTurno = turnos.find(t => t.id == selectedTurnoId || t.value == selectedTurnoId);
        onSave(selectedTurno);
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Seleccionar Turno / Horario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="text-muted">
                    Elige el horario en el que entrenará el socio para registrar su asistencia de hoy.
                </p>
                <Form.Group className="mb-3">
                    <Form.Label>Horarios Disponibles</Form.Label>
                    <Form.Select
                        value={selectedTurnoId}
                        onChange={(e) => setSelectedTurnoId(e.target.value)}
                    >
                        <option value="">-- Seleccionar --</option>
                        {turnos.map((t) => {
                            let label = t.nombre;
                            if (t.hora_inicio && t.hora_fin) {
                                const getHHMM = (timeVal) => timeVal.includes('T') ? timeVal.split('T')[1].slice(0, 5) : timeVal.slice(0, 5);
                                label = `${getHHMM(t.hora_inicio)} - ${getHHMM(t.hora_fin)}`;
                            }
                            return (
                                <option key={t.id || t.value} value={t.id || t.value}>
                                    {label}
                                </option>
                            );
                        })}
                    </Form.Select>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide} disabled={saving}>
                    Cancelar
                </Button>
                <Button
                    variant="primary"
                    onClick={handleConfirm}
                    disabled={!selectedTurnoId || saving}
                >
                    {saving ? <><Spinner size="sm" animation="border" /> Guardando...</> : 'Confirmar Turno'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
