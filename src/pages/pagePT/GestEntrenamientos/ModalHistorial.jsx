import React from 'react';
import { Modal, Button, Form, Row, Col, Spinner, Alert } from 'react-bootstrap';
import Select from 'react-select';
import { useModalHistorialLogic } from './hooks/useModalHistorialLogic';

export function ModalHistorial({ show, onHide, onSaved, catalogo = [], tiposEjercicio = [], turnos = [], idCliente, idPgm, namePgm, idDetalleMembresia, onCreateTurno, onEditTurno, initialTurno }) {
    const {
        today,
        fecha, setFecha,
        selectedTipo, handleSelectTipo, typeOptions,
        selectedEjercicio, handleSelectEjercicio, exerciseOptions,
        selectedTurno, setSelectedTurno, turnoOptions,
        momentoDia, setMomentoDia, momentoOptions, // Importar nuevos props
        series, setSeries,
        repeticiones, setRepeticiones,
        peso, setPeso,
        weightOptions, // Get Options
        tiempo, setTiempo,
        saving,
        error,
        usaPeso,
        usaTiempo,
        comentario, setComentario, // Import new state
        handleSubmit
    } = useModalHistorialLogic({ show, onHide, onSaved, catalogo, tiposEjercicio, turnos, idCliente, idPgm, namePgm, idDetalleMembresia, initialTurno });

    return (
        <Modal show={show} onHide={onHide} centered fullscreen="md-down">
            <Modal.Header closeButton>
                <Modal.Title>Agregar Ejercicio al Historial</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Fecha </Form.Label>
                        <Form.Control
                            type="date"
                            min="2020-01-01"
                            max={today.split('T')[0]}
                            value={fecha || ''}
                            onChange={e => setFecha(e.target.value)}
                            required
                        />
                    </Form.Group>

                    {namePgm && (
                        <Form.Group className="mb-3">
                            <Form.Label>Plan Vigente</Form.Label>
                            <Form.Control
                                type="text"
                                value={namePgm}
                                disabled
                                style={{ backgroundColor: '#e9ecef', fontWeight: 'bold' }}
                            />
                        </Form.Group>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label>Turno (Opcional)</Form.Label>
                        <div className="d-flex gap-2">
                            <div style={{ flex: 1 }}>
                                <Select
                                    options={momentoOptions}
                                    value={momentoDia}
                                    onChange={setMomentoDia}
                                    placeholder="Momento..."
                                    classNamePrefix="react-select"
                                    isClearable
                                />
                            </div>
                            <div style={{ flex: 2, display: 'flex', gap: '5px' }}>
                                <div style={{ flex: 1 }}>
                                    <Select
                                        options={turnoOptions}
                                        value={selectedTurno}
                                        onChange={setSelectedTurno}
                                        placeholder="Seleccione Turno..."
                                        classNamePrefix="react-select"
                                        isClearable
                                    />
                                </div>
                                {onEditTurno && (
                                    <Button
                                        variant="outline-warning"
                                        onClick={() => {
                                            if (selectedTurno) {
                                                const turnoObj = turnos.find(t => t.id === selectedTurno.value);
                                                if (turnoObj) onEditTurno(turnoObj);
                                            }
                                        }}
                                        disabled={!selectedTurno}
                                        title="Editar Turno Seleccionado"
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </Button>
                                )}
                                {onCreateTurno && (
                                    <Button variant="outline-success" onClick={onCreateTurno} title="Crear Nuevo Turno">
                                        <i className="bi bi-plus-lg"></i>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Form.Group>

                    <Row>
                        <Col xs={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Grupo Muscular</Form.Label>
                                <Select
                                    options={typeOptions}
                                    value={selectedTipo}
                                    onChange={handleSelectTipo}
                                    placeholder="Seleccione tipo..."
                                    classNamePrefix="react-select"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Ejercicio</Form.Label>
                                <Select
                                    options={exerciseOptions}
                                    value={selectedEjercicio}
                                    onChange={handleSelectEjercicio}
                                    placeholder={selectedTipo ? "Buscar ejercicio..." : "Seleccione tipo primero"}
                                    isDisabled={!selectedTipo}
                                    noOptionsMessage={() => "No se encontraron ejercicios"}
                                    classNamePrefix="react-select"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Series</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    value={series || ''}
                                    onChange={e => setSeries(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Repeticiones</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    value={repeticiones || ''}
                                    onChange={e => setRepeticiones(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Peso Alcanzado</Form.Label>
                                <Select
                                    options={weightOptions}
                                    value={weightOptions.find(o => o.value == peso) || null}
                                    onChange={val => setPeso(val ? val.value : 2.5)}
                                    isDisabled={!usaPeso}
                                    placeholder={!usaPeso ? "No aplica" : "Peso..."}
                                    classNamePrefix="react-select"
                                    isClearable
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Comentario (Opcional)</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            value={comentario || ''}
                            onChange={e => setComentario(e.target.value)}
                            placeholder="Notas sobre el ejercicio..."
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2 mt-3">
                        <Button variant="secondary" onClick={onHide}>Cancelar</Button>
                        <Button type="submit" variant="primary" disabled={saving}>
                            {saving ? <><Spinner size="sm" className="me-1" /> Guardando...</> : 'Guardar'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
