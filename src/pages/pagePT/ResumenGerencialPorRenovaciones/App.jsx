import { PageBreadcrumb } from '@/components'
import { FechaCorte } from '@/components/RangeCalendars/FechaRange'
import React, { useEffect } from 'react'
import { DataTableOrigen } from './DataTableRenovaciones'
import { useRenovacionesStore } from './hook/useRenovacionesStore'
import { Col, Row } from 'react-bootstrap'

export const App = () => {
  const { dataSeguimientosConReno, dataSeguimientosSinReno, obtenerSeguimientos, obtenerVentas } = useRenovacionesStore()
  useEffect(() => {
    obtenerSeguimientos()
    obtenerVentas()
  }, [])
    const data = [
      {
        anio: 2025,
        mes: 1,
        itemsSeguimientos: [],
        itemsRenovaciones: []
      }
    ]
    
  return (
    <div>
      <PageBreadcrumb title={'DETALLE RENOVACIONES'}/>
        {/* <FechaCorte inicio={2} corte={5}/> */}
        <Row>
          <Col lg={3}>
            <DataTableOrigen />
          </Col>
        </Row>
    </div>
  )
}
