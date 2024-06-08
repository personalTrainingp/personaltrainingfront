import { PageBreadcrumb } from '@/components'
import React from 'react'
import { Card, Tab, Tabs } from 'react-bootstrap'
import TodoVentas from './VentasTotal'

export const GestionVentas = () => {
  return (
    <>
    <PageBreadcrumb title="Ventas" subName="Ventas" />
    <Card>
        <Card.Body>
            <Tabs>
                <Tab eventKey={1} title="Ventas">
                    <TodoVentas/>
                </Tab>
                <Tab eventKey={2} title="Ventas de Programas">
                    <div>Compras</div>
                </Tab>
                <Tab eventKey={3} title="Ventas de productos">
                    <div>Devoluciones</div>
                </Tab>
                <Tab eventKey={4} title="Ventas de citas">
                    <div>Facturas</div>
                </Tab>
            </Tabs>
        </Card.Body>
    </Card>
    </>
  )
}
