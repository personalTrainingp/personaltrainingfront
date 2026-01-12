import { PageBreadcrumb } from '@/components'
import { FechaCorte } from '@/components/RangeCalendars/FechaRange'
import React, { useEffect, useState } from 'react'
import { DataTableOrigen } from './DataTableOrigen'
import { useRenovacionesStore } from './hook/useRenovacionesStore'
import { Col, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'

export const App2 = ({dataVentasMembresia, dataVentasMembresiaReal}) => {
  console.log({dataVentasMembresia, dataVentasMembresiaReal});
  
  return (
    <div>
      <Row>
        {
          dataVentasMembresia.map(membresia=>{
            return (
              <Col lg={4}>
                <DataTableOrigen anio={membresia.anio} mes={membresia.mes} renovaciones={membresia.items}/>
              </Col>
            )
          })
        }
      </Row>
    </div>
  )
}