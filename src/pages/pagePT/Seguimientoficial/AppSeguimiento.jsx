import React, { useEffect } from 'react'
import { useSeguimientoStore } from './useSeguimientoStore'
import { Col, Row } from 'react-bootstrap'
import { TableSeguimientos } from './TableSeguimientos'

export const AppSeguimiento = () => {
    const { obtenerSeguimientoxFecha, dataSeguimientoxFecha } = useSeguimientoStore()
    useEffect(() => {
        obtenerSeguimientoxFecha()
    }, [])
    const fecha = new Date()

  return (
    <div className='tab-scroll-container'>
      <div className='fs-1 fw-bold text-change d-flex flex-row'>
        <TableSeguimientos bodyHeadcontadorDia={<>SESIONES <br/> PENDIENTES</>} dataSeguimientoxFecha={dataSeguimientoxFecha} title={<><span className='text-change'>SOCIOS ACTIVOS </span></>} rangeDate={["2026-07-22T12:00:00.000Z", "2030-03-16T12:00:00.000Z"]}/>
        <TableSeguimientos bodyHeadcontadorDia={<>DIAS <br/> VENCIDOS</>} dataSeguimientoxFecha={dataSeguimientoxFecha} title={<><span className='text-change'>RENOVACIONES VENCIDAS</span></>} rangeDate={[ "2026-02-22T12:00:00.000Z","2026-07-21T12:00:00.000Z"]}/>
        <TableSeguimientos bodyHeadcontadorDia={<>DIAS <br/> VENCIDOS</>} dataSeguimientoxFecha={dataSeguimientoxFecha} title={<><span className='text-change'>REINSCRIPCIONES VENCIDAS</span></>} rangeDate={["2024-09-16T12:00:00.000Z", "2026-02-21T12:00:00.000Z"]}/>

      </div>
    </div>
  )
}
