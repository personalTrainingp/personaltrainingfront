import React from 'react'
import Shipping from '../Shipping'
import { Card, CardTitle } from 'react-bootstrap'

export const CardVenta = ({dataVenta, datos_pagos, detalle_cli_modelo}) => {
  return (
    <Card>
        <Card.Header>
            <Card.Title>Datos Ventas</Card.Title>
        </Card.Header>
        <Card.Body>
            <Shipping dataVenta={dataVenta} detalle_cli_modelo={detalle_cli_modelo} datos_pagos={datos_pagos}/>
        </Card.Body>
    </Card>
  )
}
