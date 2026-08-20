import React, { useEffect } from 'react'
import { useSeguimientoStore } from './useSeguimientoStore'
import { Col, Row } from 'react-bootstrap'
import { TableSeguimientos } from './TableSeguimientos'
export const AppSeguimiento = () => {
    const { obtenerSeguimientoxFecha, dataSeguimientoxFecha } = useSeguimientoStore();

    useEffect(() => {
        obtenerSeguimientoxFecha();
    }, []);

    const fechaActual = new Date();

    // Fecha actual
    const fechaActualStr = fechaActual.toISOString();

    // Fecha de hace 3 meses
    const fechaInicioRenovaciones = new Date(fechaActual);
    fechaInicioRenovaciones.setMonth(fechaInicioRenovaciones.getMonth() - 3);

    // Formatear fechas
    const fechaInicioRenovacionesStr = fechaInicioRenovaciones.toISOString();

    // Reinscripciones: desde 2024 hasta el día anterior al inicio de renovaciones
    const fechaInicioReinscripciones = "2024-01-01T12:00:00.000Z";

    const fechaFinReinscripciones = fechaInicioRenovaciones.toISOString();

    return (
        <div className="tab-scroll-container">
            <div className="fs-1 fw-bold text-change d-flex flex-row">

                {/* SOCIOS ACTIVOS */}
                <TableSeguimientos
                    bodyHeadcontadorDia={
                        <>
                            SESIONES <br /> PENDIENTES
                        </>
                    }
                    dataSeguimientoxFecha={dataSeguimientoxFecha}
                    title={
                        <>
                            <span className="text-change">
                                SOCIOS ACTIVOS
                            </span>
                        </>
                    }
                    rangeDate={[
                        fechaActualStr,
                        "2040-03-16T12:00:00.000Z"
                    ]}
                />

                {/* RENOVACIONES */}
                <TableSeguimientos
                    bodyHeadcontadorDia={
                        <>
                            DIAS <br /> VENCIDOS
                        </>
                    }
                    dataSeguimientoxFecha={dataSeguimientoxFecha}
                    title={
                        <>
                            <span className="text-change">
                                RENOVACIONES VENCIDAS
                            </span>
                        </>
                    }
                    rangeDate={[
                        fechaInicioRenovacionesStr,
                        fechaActualStr
                    ]}
                />

                {/* REINSCRIPCIONES */}
                <TableSeguimientos
                    bodyHeadcontadorDia={
                        <>
                            DIAS <br /> VENCIDOS
                        </>
                    }
                    dataSeguimientoxFecha={dataSeguimientoxFecha}
                    title={
                        <>
                            <span className="text-change">
                                REINSCRIPCIONES VENCIDAS
                            </span>
                        </>
                    }
                    rangeDate={[
                        fechaInicioReinscripciones,
                        fechaFinReinscripciones
                    ]}
                />

            </div>
        </div>
    );
};