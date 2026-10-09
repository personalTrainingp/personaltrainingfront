import React, { useEffect, useMemo } from 'react'
import dayjs from 'dayjs'
import { hoyPeru, useSeguimientoStore } from './useSeguimientoStore'
import { TableSeguimientos } from './TableSeguimientos'
export const AppSeguimiento = () => {
    const { obtenerSeguimientoxFecha, dataSeguimientoxFecha, tieneHuella } = useSeguimientoStore();

    useEffect(() => {
        obtenerSeguimientoxFecha();
    }, []);

    // Rangos como fechas 'YYYY-MM-DD' en hora peruana: [desde, hasta) — incluye "desde", excluye "hasta",
    // así cada socio cae en una sola tabla.
    const { hoy, inicioRenovaciones } = useMemo(() => {
        const hoy = hoyPeru();
        return { hoy, inicioRenovaciones: dayjs(hoy).subtract(3, 'month').format('YYYY-MM-DD') };
    }, []);

    return (
        <div className="tab-scroll-container">
            <div className="fs-1 fw-bold text-change d-flex flex-row">

                {/* SOCIOS ACTIVOS: vencen hoy o después */}
                <TableSeguimientos
                    bodyHeadcontadorDia="SESIONES PENDIENTES"
                    contadorKey="sesionesPendientes"
                    contadorLabel="SESIONES"
                    dataSeguimientoxFecha={dataSeguimientoxFecha}
                    tieneHuella={tieneHuella}
                    title={<span className="text-change">SOCIOS ACTIVOS</span>}
                    nombreExcel="socios-activos"
                    desde={hoy}
                />

                {/* RENOVACIONES: vencieron en los últimos 3 meses */}
                <TableSeguimientos
                    bodyHeadcontadorDia="DIAS VENCIDOS"
                    contadorKey="diasVencidos"
                    contadorLabel="DIAS"
                    dataSeguimientoxFecha={dataSeguimientoxFecha}
                    tieneHuella={tieneHuella}
                    title={<span className="text-change">RENOVACIONES VENCIDAS</span>}
                    nombreExcel="renovaciones-vencidas"
                    desde={inicioRenovaciones}
                    hasta={hoy}
                />

                {/* REINSCRIPCIONES: vencieron desde 2024 hasta antes de los últimos 3 meses */}
                <TableSeguimientos
                    bodyHeadcontadorDia="DIAS VENCIDOS"
                    contadorKey="diasVencidos"
                    contadorLabel="DIAS"
                    dataSeguimientoxFecha={dataSeguimientoxFecha}
                    tieneHuella={tieneHuella}
                    title={<span className="text-change">REINSCRIPCIONES VENCIDAS</span>}
                    nombreExcel="reinscripciones-vencidas"
                    desde="2024-01-01"
                    hasta={inicioRenovaciones}
                />

            </div>
        </div>
    );
};
