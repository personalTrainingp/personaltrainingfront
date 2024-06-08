import { PageBreadcrumb } from '@/components'
import React, { useEffect } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { CardCliente } from './CardCliente'
import { CardVenta } from './CardVenta'
import { CardPago } from './CardPago'
import { useSelector } from 'react-redux'
import { useImpuestosStore } from '@/hooks/hookApi/useImpuestosStore'

export const NuevaVenta2 = () => {

	const { venta, detalle_cli_modelo, datos_pagos } = useSelector(e=>e.uiNuevaVenta)
  return (
    <>
    <PageBreadcrumb title="Nueva venta" subName="ventas" />
    <Row>
        <Col lg={3}>
            <CardPago venta={venta} dataPagos={datos_pagos}/>
            <CardCliente dataCliente={detalle_cli_modelo}/>
        </Col>
        <Col lg={9}>
            <CardVenta dataVenta={venta} detalle_cli_modelo={detalle_cli_modelo} datos_pagos={datos_pagos}/>
        </Col>
    </Row>
    </>
  )
}
