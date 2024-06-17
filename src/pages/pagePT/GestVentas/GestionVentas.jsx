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
                    <TodoVentas/>
        </Card.Body>
    </Card>
    </>
  )
}
