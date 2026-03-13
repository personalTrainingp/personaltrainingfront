import React from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import Select from 'react-select';
import { useModalEditarCatalogoLogic } from './hooks/useModalEditarCatalogoLogic';

export function ModalEditarCatalogo({ show, onHide, onUpdated, catalogo = [] }) {
    const {
        tipos,
        selectedTipo, setSelectedTipo,
        filterTipo, setFilterTipo,
        selectedOption,
        nombre, setNombre,
        descripcion, setDescripcion,
        urlVideo, setUrlVideo,
        esMaquina, setEsMaquina,
        saving,
        handleSelectChange,
        handleSubmit,
        options
    } = useModalEditarCatalogoLogic({ show, onHide, onUpdated, catalogo });

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Editar Entrenamiento (Catálogo)</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {/* FILTRO POR TIPO */}
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold text-primary">1. Filtrar por Grupo Muscular</Form.Label>
                        <Select
                            options={tipos}
                            value={filterTipo}
                            onChange={setFilterTipo}
                            placeholder="Todos los grupos..."
                            isClearable
                            classNamePrefix="react-select"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold text-primary">2. Seleccionar Entrenamiento</Form.Label>
                        <Select
                            options={options}
                            value={selectedOption}
                            onChange={handleSelectChange}
                            placeholder="Buscar entrenamiento..."
                            noOptionsMessage={() => "No hay entrenamientos para este filtro"}
                            isClearable
                            classNamePrefix="react-select"
                        />
                    </Form.Group>

                    {selectedOption && (
                        <div className="fade-in">
                            <Form.Group className="mb-3">
                                <Form.Label>Grupo Muscular</Form.Label>
                                <Select
                                    options={tipos}
                                    value={selectedTipo}
                                    onChange={setSelectedTipo}
                                    placeholder="Seleccione tipo..."
                                    classNamePrefix="react-select"
                                />
                            </Form.Group>

                            {/* ES MAQUINA SWITCH */}
                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="switch"
                                    id="esMaquina-edit-switch"
                                    label="¿Es una Máquina? (Pesos de 10kg)"
                                    checked={esMaquina}
                                    onChange={(e) => setEsMaquina(e.target.checked)}
                                    className="fw-bold text-primary"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Nuevo Nombre*</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={nombre}
                                    onChange={e => setNombre(e.target.value)}
                                    autoFocus
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Nueva Descripción</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={descripcion}
                                    onChange={e => setDescripcion(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>URL Video</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="https://youtube.com/..."
                                    value={urlVideo}
                                    onChange={e => setUrlVideo(e.target.value)}
                                />
                            </Form.Group>
                        </div>
                    )}

                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <Button variant="secondary" onClick={onHide}>Cancelar</Button>
                        <Button
                            type="submit"
                            variant="warning"
                            disabled={saving || !selectedOption}
                        >
                            {saving ? <><Spinner size="sm" className="me-1" /> Guardando...</> : 'Actualizar'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
