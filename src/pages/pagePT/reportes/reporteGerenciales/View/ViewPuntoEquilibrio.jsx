import React, { useEffect } from 'react'
import { TableEgresos } from './TableEgresos'
import { Col, Row } from 'react-bootstrap'
import { TableIngresos } from './TableIngresos'
import { usePuntoEquilibrio } from '../hook/usePuntoEquilibrio'

export const ViewPuntoEquilibrio = ({id_empresa, bgTotal, rangeDate}) => {
    const { obtenerEgresos, obtenerVentas, dataEgresos,  } = usePuntoEquilibrio()
    useEffect(() => {
        obtenerEgresos(rangeDate, id_empresa)
        obtenerVentas(rangeDate, id_empresa)
    }, [])
    
  return (
    <div>
        <Row>
            <Col lg={7}>
                <TableEgresos data={dataEgresos} bgTotal={bgTotal}/>
            </Col>
            <Col lg={5}>
                <TableIngresos/>
            </Col>
        </Row>
    </div>
  )
}
