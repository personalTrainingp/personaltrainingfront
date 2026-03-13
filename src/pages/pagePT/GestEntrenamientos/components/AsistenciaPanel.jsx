import React, { useEffect, useState } from 'react';
import { Card, Badge, Button, Row, Col, ProgressBar } from 'react-bootstrap';
import { AsyncPaginate } from 'react-select-async-paginate';
import { entrenamientosApi } from '../../../../api/entrenamientosApi';

const defaultAdditional = { page: 1 };
const asyncPaginateStyles = {
    control: (base) => ({
        ...base,
        minHeight: '45px',
        fontSize: '1.3rem'
    }),
    menu: (base) => ({ ...base, zIndex: 9999 })
};

export const AsistenciaPanel = ({
    idVenta,
    planName,
    calculatedEndDate,
    usedSessions,
    totalSessions,
    diasCongelamiento,
    citasNutricionales,
    valGeneral,
    onSelectGeneral,
    loadClientes,
    textoTurno,
    onAddRow,
    canAdd
}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (idVenta && (usedSessions === undefined || totalSessions === undefined)) {
            setLoading(true);
            entrenamientosApi.getAsistenciasConPlan(idVenta)
                .then(res => {
                    if (res.ok && res.data) {
                        let found = null;
                        if (Array.isArray(res.data)) {
                            const currentId = Number(idVenta);
                            found = res.data.find(item => item.id_venta === currentId);
                        } else {
                            found = res.data;
                        }
                        setData(found || {});
                    }
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [idVenta, usedSessions, totalSessions]);

    const sesiones_usadas = usedSessions !== undefined ? usedSessions : (data?.asistencias_realizadas || 0);
    const sesiones_totales = totalSessions !== undefined ? totalSessions : (data?.sesiones_totales || 0);
    const fec_fin_mem_oftime = data?.fec_fin_mem_oftime;

    // Calculamos porcentaje para la barra visual
    const porcentaje = sesiones_totales > 0 ? (sesiones_usadas / sesiones_totales) * 100 : 0;

    // Calculamos pendientes para darle más contexto al usuario (Opcional, pero muy intuitivo)
    const pendientes = sesiones_totales - sesiones_usadas;

    const formatDate = (d) => {
        if (!d) return 'N/A';
        const dateObj = new Date(d);
        return dateObj.toLocaleDateString();
    };

    return (
        <Card className="shadow-sm border-0 mb-3" style={{ borderRadius: 12, background: '#f8f9fa' }}>
            <Card.Body className="p-3">

                {/* 1. CABECERA MEJORADA: Título vs Estadísticas Visuales */}
                <Row className="align-items-center mb-4">
                    <Col xs={12} md={4} className="mb-2 mb-md-0">
                        <h6 className="m-0 text-primary fw-bold text-uppercase" style={{ fontSize: '1.3rem' }}>
                            <i className="bi bi-calendar-check me-2"></i> Asistencia
                        </h6>
                    </Col>

                    {/* SECCIÓN INTUITIVA DE PROGRESO (Derecha) */}
                    <Col xs={12} md={8}>
                        <div className="d-flex align-items-center justify-content-md-end justify-content-between bg-light p-2 rounded border gap-3">

                            {/* Bloque Asistidas */}
                            <div className="text-center px-2">
                                <div className="text-primary fw-bold" style={{ fontSize: '1.5rem', lineHeight: 1 }}>
                                    {sesiones_usadas}
                                </div>
                                <small className="text-muted fw-bold" style={{ fontSize: '0.65rem' }}>ASISTIÓ</small>
                            </div>

                            {/* Barra Visual */}
                            <div className="flex-grow-1" style={{ maxWidth: '200px', minWidth: '100px' }}>
                                <ProgressBar
                                    now={porcentaje}
                                    variant={porcentaje >= 100 ? "success" : "primary"}
                                    style={{ height: '10px', borderRadius: '5px' }}
                                />
                                <div className="text-center text-muted mt-1" style={{ fontSize: '0.7rem' }}>
                                    {pendientes > 0 ? `${pendientes} Pendientes` : 'Completado'}
                                </div>
                            </div>

                            {/* Bloque Totales */}
                            <div className="text-center px-2 border-start">
                                <div className="text-dark fw-bold" style={{ fontSize: '1.5rem', lineHeight: 1 }}>
                                    {sesiones_totales}
                                </div>
                                <small className="text-muted fw-bold" style={{ fontSize: '0.65rem' }}>TOTAL</small>
                            </div>

                        </div>
                    </Col>
                </Row>

                {/* 2. INFO PLAN: Nombre + Horario + Extras */}
                <div className="mb-4">
                    <div className="d-flex flex-wrap align-items-center gap-2">
                        <div className="border rounded px-2 py-1 fw-bold text-uppercase text-white" style={{ fontSize: '1rem', letterSpacing: '0.5px', backgroundColor: '#C00000' }}>
                            DURACIÓN DEL CONTRATO:
                        </div>

                        <span className="fw-bold text-uppercase px-2 rounded text-white" style={{ fontSize: '1.3rem', backgroundColor: '#C00000' }}>
                            {planName || 'PLAN ACTUAL'}
                        </span>

                        <Badge bg="light" text="dark" className="border d-flex align-items-center" style={{ fontSize: '1.3rem' }}>
                            <i className="bi bi-alarm text-muted me-2"></i>
                            <span className="text-primary fw-bold">{textoTurno || '--:--'}</span>
                        </Badge>

                        {diasCongelamiento > 0 && (
                            <Badge bg="warning" text="dark" className="fw-normal">
                                {diasCongelamiento} Días Congel.
                            </Badge>
                        )}
                        {citasNutricionales > 0 && (
                            <Badge bg="success" className="fw-normal">
                                {citasNutricionales} Nutrición
                            </Badge>
                        )}
                    </div>
                </div>

                {/* 3. CONTROLES: Select, Botón y Vencimiento */}
                <Row className="align-items-end g-2">
                    {/* Selector */}
                    <Col md={3} sm={12}>
                        <label className="form-label text-muted fw-bold text-uppercase small mb-1" style={{ fontSize: '1rem' }}>
                            <i className="bi bi-person me-1"></i> Socios Fisio Muscle
                        </label>
                        <AsyncPaginate
                            value={valGeneral}
                            onChange={onSelectGeneral}
                            loadOptions={loadClientes}
                            additional={defaultAdditional}
                            placeholder="Buscar..."
                            classNamePrefix="react-select"
                            debounceTimeout={300}
                            isClearable
                            styles={asyncPaginateStyles}
                        />
                    </Col>

                    {/* Botón + Fecha Vencimiento */}
                    <Col md={5} sm={12} className="pb-1">
                        <div className="d-flex align-items-center gap-2">
                            <Button
                                variant="outline-danger"
                                className="flex-grow-1 d-flex align-items-center justify-content-center text-uppercase fw-bold"
                                style={{ height: '45px', fontSize: '1.3rem', color: '#dc3545', borderColor: '#dc3545' }}
                                onClick={onAddRow}
                            >
                                <i className="bi bi-plus-circle me-2"></i> Agregar
                            </Button>

                            <Badge bg="danger" className="text-white d-flex align-items-center justify-content-center" style={{ fontSize: '1.1rem', height: '45px', padding: '0 1em' }}>
                                <div className="text-center" style={{ lineHeight: 1.2 }}>
                                    <small style={{ fontSize: '0.7rem', display: 'block', opacity: 0.8 }}>VENCE EL</small>
                                    {formatDate(calculatedEndDate || fec_fin_mem_oftime)}
                                </div>
                            </Badge>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};