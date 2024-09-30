import React from 'react'
import Shipping from '../Shipping'
import { Card, CardTitle } from 'react-bootstrap'

export const CardVenta = ({dataVenta, datos_pagos, detalle_cli_modelo, funToast}) => {
  return (
    <Card>
        <Card.Body>
            <Shipping dataVenta={dataVenta} detalle_cli_modelo={detalle_cli_modelo} datos_pagos={datos_pagos} funToast={funToast}/>
        </Card.Body>
    </Card>
  )
}
