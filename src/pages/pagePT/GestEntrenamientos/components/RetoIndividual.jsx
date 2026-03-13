import React from 'react';
import { Accordion, Row, Col, Form, Button, Image, Badge } from 'react-bootstrap';
import { useResultadosRetoLogic } from '../hooks/useResultadosRetoLogic';

export const RetoIndividual = ({ retoData, idCliente, onSaveSuccess, defaultOpen = false, index, defaultWeeks }) => {

    const {
        data,
        loading,
        exists,
        isEditing,
        setIsEditing,
        handleChange,
        handlePhoto,
        handleSave,
        weeksDuration
    } = useResultadosRetoLogic({
        idCliente,
        initialData: retoData,
        onSaveSuccess,
        defaultWeeks // Pass defaultWeeks to hook
    });

    const calcDiff = (start, end) => {
        if (!start || !end) return null;
        return (end - start).toFixed(2);
    }

    const diffPeso = calcDiff(data.peso_inicial, data.peso_final);
    const diffGrasa = calcDiff(data.grasa_inicial, data.grasa_final);
    const diffMusc = calcDiff(data.musculo_inicial, data.musculo_final);

    const title = retoData?.programa_nombre_calculado || "Nuevo Reto";
    const statusDate = data.fecha_registro_final || 'En curso';

    return (
        <Accordion.Item eventKey={index.toString()}>
            <Accordion.Header>
                <div className="d-flex align-items-center w-100 justify-content-between pe-3">
                    <span className="fw-bold text-primary" style={{ fontSize: '20px' }}>
                        <i className="bi bi-trophy me-2"></i>
                        {title}
                        <span className="text-muted ms-2 small">
                            ({statusDate})
                        </span>
                    </span>
                    <div className='d-flex align-items-center gap-2'>
                        {!isEditing && (
                            <div
                                className="btn btn-outline-primary btn-sm"
                                onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                                role="button"
                            >
                                <i className="bi bi-pencil"></i> Editar
                            </div>
                        )}
                        {exists ?
                            <Badge bg="success">Registrado</Badge> :
                            <Badge bg="secondary">Borrador</Badge>
                        }
                    </div>
                </div>
            </Accordion.Header>
            <Accordion.Body>
                <Row>
                    {/* COLUMNA INICIO */}
                    <Col md={6} className="border-end">
                        <h6 className="text-center text-muted text-uppercase mb-3">Inicio del Reto</h6>
                        <div className="mb-2">
                            <Form.Label className="small text-muted mb-0">
                                Fecha Inicio
                                {weeksDuration > 0 && <span className="text-info ms-2">({weeksDuration} sem)</span>}
                            </Form.Label>
                            <Form.Control style={{ fontSize: '20px' }} type="date"
                                size="sm"
                                name="fecha_registro_inicial"
                                value={data.fecha_registro_inicial || ''}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>
                        {/* Foto Cuerpo */}
                        <div className="text-center mb-3">
                            <small className="text-muted d-block mb-1">Foto LATERAL</small>

                            {data.foto_inicial ? (
                                <Image src={data.foto_inicial} thumbnail style={{ maxHeight: '150px' }} />
                            ) : (
                                <div className="text-muted p-4 border bg-light rounded">Sin Foto Inicial</div>
                            )}
                            {isEditing && (
                                <Form.Control style={{ fontSize: '20px' }} type="file" size="sm" className="mt-2" onChange={(e) => handlePhoto(e, 'foto_inicial')} />
                            )}
                        </div>
                        {/* Foto Cara */}
                        <div className="text-center mb-3">
                            <small className="text-muted d-block mb-1">Foto Frontal</small>
                            {data.foto_inicio_frontal ? (
                                <Image src={data.foto_inicio_frontal} thumbnail style={{ maxHeight: '150px' }} />
                            ) : (
                                <div className="text-muted p-4 border bg-light rounded" style={{ fontSize: '0.8rem' }}>Sin Foto Frontal</div>
                            )}
                            {isEditing && (
                                <Form.Control style={{ fontSize: '20px' }} type="file" size="sm" className="mt-2" onChange={(e) => handlePhoto(e, 'foto_inicio_frontal')} />
                            )}
                        </div>

                        <Row className="g-2">
                            <Col xs={4}>
                                <Form.Label><small>Peso Inicial(KG)</small></Form.Label>
                                <Form.Control style={{ fontSize: '20px' }} type="number" name="peso_inicial" value={data.peso_inicial || ''} onChange={handleChange} disabled={!isEditing} />
                            </Col>
                            <Col xs={4}>
                                <Form.Label><small>% Grasa Inicial</small></Form.Label>
                                <Form.Control style={{ fontSize: '20px' }} type="number" name="grasa_inicial" value={data.grasa_inicial || ''} onChange={handleChange} disabled={!isEditing} />
                            </Col>
                            <Col xs={4}>
                                <Form.Label><small>% Músculo Inicial</small></Form.Label>
                                <Form.Control style={{ fontSize: '20px' }} type="number" name="musculo_inicial" value={data.musculo_inicial || ''} onChange={handleChange} disabled={!isEditing} />
                            </Col>
                        </Row>
                    </Col>

                    {/* COLUMNA FINAL */}
                    <Col md={6}>
                        <h6 className="text-center text-success text-uppercase mb-3">Fin del Reto</h6>
                        <div className="mb-2">
                            <Form.Label className="small text-muted mb-0">Fecha Cierre</Form.Label>
                            <Form.Control style={{ fontSize: '20px' }} type="date"
                                size="sm"
                                name="fecha_registro_final"
                                value={data.fecha_registro_final || ''}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>

                        {/* Foto Cuerpo Fin */}
                        <div className="text-center mb-3">
                            <small className="text-muted d-block mb-1">Foto LATERAL</small>

                            {data.foto_final ? (
                                <Image src={data.foto_final} thumbnail style={{ maxHeight: '150px' }} />
                            ) : (
                                <div className="text-muted p-4 border bg-light rounded">Sin Foto Final</div>
                            )}
                            {isEditing && (
                                <Form.Control style={{ fontSize: '20px' }} type="file" size="sm" className="mt-2" onChange={(e) => handlePhoto(e, 'foto_final')} />
                            )}
                        </div>
                        {/* Foto Cara Fin */}
                        <div className="text-center mb-3">
                            <small className="text-muted d-block mb-1">Foto Frontal</small>
                            {data.foto_fin_frontal ? (
                                <Image src={data.foto_fin_frontal} thumbnail style={{ maxHeight: '150px' }} />
                            ) : (
                                <div className="text-muted p-4 border bg-light rounded" style={{ fontSize: '0.8rem' }}>Sin Foto Frontal</div>
                            )}
                            {isEditing && (
                                <Form.Control style={{ fontSize: '20px' }} type="file" size="sm" className="mt-2" onChange={(e) => handlePhoto(e, 'foto_fin_frontal')} />
                            )}
                        </div>

                        <Row className="g-2">
                            <Col xs={4}>
                                <Form.Label><small>Peso Final</small></Form.Label>
                                <Form.Control style={{ fontSize: '20px' }} type="number" name="peso_final" value={data.peso_final || ''} onChange={handleChange} disabled={!isEditing} />
                            </Col>
                            <Col xs={4}>
                                <Form.Label><small>% Grasa Fin</small></Form.Label>
                                <Form.Control style={{ fontSize: '20px' }} type="number" name="grasa_final" value={data.grasa_final || ''} onChange={handleChange} disabled={!isEditing} />
                            </Col>
                            <Col xs={4}>
                                <Form.Label><small>% Músculo Fin</small></Form.Label>
                                <Form.Control style={{ fontSize: '20px' }} type="number" name="musculo_final" value={data.musculo_final || ''} onChange={handleChange} disabled={!isEditing} />
                            </Col>
                        </Row>

                        {/* ASISTENCIA Y FALTAS */}
                        <div className="mt-2 d-flex justify-content-end gap-3" style={{ fontSize: '20px' }}>
                            <span className="text-primary fw-bold">
                                <i className="bi bi-check-circle me-1"></i>
                                Asistido: {retoData?.asistencias_realizadas || 0} dias
                            </span>
                            <span className="text-danger fw-bold">
                                <i className="bi bi-x-circle me-1"></i>
                                No Asistido: {Math.max((retoData?.sesiones_totales || 0) - (retoData?.asistencias_realizadas || 0), 0)} dias
                            </span>
                        </div>
                    </Col>
                </Row>

                {/* VISUAL CALCULATOR & COMMENTS */}
                <hr />
                <Row className="align-items-end">
                    <Col md={8}>
                        <Form.Label>Comentarios / Observaciones</Form.Label>
                        <Form.Control
                            style={{ fontSize: '20px' }}
                            as="textarea"
                            rows={2}
                            name="comentarios"
                            value={data.comentarios || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </Col>
                    <Col md={4} className="text-end">
                        <div className="mb-2 text-end" style={{ fontSize: '20px' }}>
                            {diffPeso && <div className={diffPeso < 0 ? "text-success fw-bold" : "text-danger"}>Peso: {diffPeso} kg</div>}
                            {diffGrasa && <div className={diffGrasa < 0 ? "text-info fw-bold" : "text-muted"}>Grasa: {diffGrasa} %</div>}
                            {diffMusc && <div className={diffMusc > 0 ? "text-warning fw-bold" : "text-muted"}>Músculo: {diffMusc} %</div>}
                        </div>

                        {isEditing && (
                            <div className="d-flex gap-2 justify-content-end">
                                <Button variant="outline-secondary" size="sm" onClick={() => setIsEditing(false)}>
                                    Cancelar
                                </Button>
                                <Button variant="primary" size="sm" onClick={handleSave} disabled={loading}>
                                    {loading ? 'Guardando...' : 'Guardar'}
                                </Button>
                            </div>
                        )}
                    </Col>
                </Row>
            </Accordion.Body>
        </Accordion.Item>
    );
};
