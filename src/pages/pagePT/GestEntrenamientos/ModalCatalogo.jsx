import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import Select from 'react-select';
import { useModalCatalogoLogic } from './hooks/useModalCatalogoLogic';
import { ModalTipoEjercicio } from './ModalTipoEjercicio';

export function ModalCatalogo({ show, onHide, onSaved }) {
    const [showTypeModal, setShowTypeModal] = useState(false);
    const {
        tipos,
        selectedTipo, setSelectedTipo,
        nombre, setNombre,
        descripcion, setDescripcion,
        urlVideo, setUrlVideo,
        esMaquina, setEsMaquina,
        saving,
        handleSubmit,
        handleClose,
        onTipoCreated
    } = useModalCatalogoLogic({ show, onHide, onSaved });

    return (
        <>
            <Modal show={show} onHide={handleClose} centered backdrop="static">
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title className="h5 fw-bold text-primary">
                        <i className="bi bi-journal-plus me-2"></i>
                        Nuevo Entrenamiento
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="p-4">
                    <Form onSubmit={handleSubmit}>

                        {/* SECCIÓN TIPO DE EJERCICIO MEJORADA */}
                        <Form.Group className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <Form.Label className="mb-0 fw-bold">Grupo Muscular <span className="text-danger">*</span></Form.Label>
                                {/* BOTÓN DE ACCIÓN CLARO Y VISIBLE */}
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="text-decoration-none fw-bold p-0"
                                    onClick={() => setShowTypeModal(true)}
                                >
                                    <i className="bi bi-plus-circle-fill me-1"></i>
                                    Crear Nuevo Tipo
                                </Button>
                            </div>

                            <Select
                                options={tipos}
                                value={selectedTipo}
                                onChange={setSelectedTipo}
                                placeholder="Seleccione una categoría (Ej: Cardio)..."
                                classNamePrefix="react-select"
                                isClearable
                                noOptionsMessage={() => "No hay tipos creados. ¡Crea uno nuevo!"}
                            />
                        </Form.Group>

                        {/* ES MAQUINA SWITCH */}
                        <Form.Group className="mb-4">
                            <Form.Check
                                type="switch"
                                id="esMaquina-switch"
                                label="¿Es una Máquina? (Pesos de 10kg)"
                                checked={esMaquina}
                                onChange={(e) => setEsMaquina(e.target.checked)}
                                className="fw-bold text-primary"
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">Nombre del Entrenamiento <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ej: Press de Banca Plano"
                                value={nombre}
                                onChange={e => setNombre(e.target.value)}
                                className="py-2"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">URL Video <span className="text-muted fw-normal">(Opcional)</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="https://youtube.com/..."
                                value={urlVideo}
                                onChange={e => setUrlVideo(e.target.value)}
                                className="py-2"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Descripción <span className="text-muted fw-normal">(Opcional)</span></Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Breve explicación técnica o notas..."
                                value={descripcion}
                                onChange={e => setDescripcion(e.target.value)}
                                className="py-2"
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2 mt-4 pt-2 border-top">
                            <Button variant="outline-secondary" onClick={handleClose} className="px-4">
                                Cancelar
                            </Button>
                            <Button type="submit" variant="primary" disabled={saving} className="px-4 fw-bold">
                                {saving ? <><Spinner size="sm" className="me-2" />Guardando...</> : 'Guardar Entrenamiento'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal para crear el tipo */}
            <ModalTipoEjercicio
                show={showTypeModal}
                onHide={() => setShowTypeModal(false)}
                onSaved={onTipoCreated}
            />
        </>
    );
}