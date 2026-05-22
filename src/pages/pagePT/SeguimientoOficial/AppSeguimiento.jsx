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
    <div>
      <Row>
        <Col lg={6}>
          <TableSeguimientos dataSeguimientoxFecha={dataSeguimientoxFecha} title={<><span className='text-change'>SOCIOS ACTIVOS </span></>} rangeDate={["2026-05-22T12:00:00.000Z", "2030-03-16T12:00:00.000Z"]}/>
        </Col>
        <Col lg={6}>
          <TableSeguimientos dataSeguimientoxFecha={dataSeguimientoxFecha} title={<><span className='text-change'>RENOVACIONES VENCIDAS</span></>} rangeDate={[ "2026-02-22T12:00:00.000Z","2026-05-21T12:00:00.000Z"]}/>
        </Col>
        <Col lg={6}>
          <TableSeguimientos dataSeguimientoxFecha={dataSeguimientoxFecha} title={<><span className='text-change'>REINSCRIPCIONES VENCIDAS</span></>} rangeDate={["2024-09-16T12:00:00.000Z", "2026-02-21T12:00:00.000Z"]}/>
        </Col>
      </Row>
    </div>
  )
}
