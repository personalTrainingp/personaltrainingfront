import { PageBreadcrumb } from '@/components'
import React from 'react'
import { Card, Tab, Tabs } from 'react-bootstrap'
import TodoVentas from './VentasTotal'
import { TabPanel, TabView } from 'primereact/tabview'

export const GestionVentas = () => {
  return (
    <>
    <PageBreadcrumb title="COMPROBANTES DE VENTAS POR DIA" subName="Ventas" />
    <Card>
        <Card.Body>
                    <TabView>
                      <TabPanel header='CHANGE'>
                          <TodoVentas id_empresa={598}/>
                      </TabPanel>
                      <TabPanel header='HISTORICO'>
                          <TodoVentas id_empresa={0}/>
                      </TabPanel>
                    </TabView>
        </Card.Body>
    </Card>
    </>
  )
}
