import { PageBreadcrumb } from '@/components'
import { TabPanel, TabView } from 'primereact/tabview'
import React from 'react'
import { Card } from 'react-bootstrap'
import { DataTableVentas } from './DataTableVentas'

export const AppVentas = () => {
  return (
    <>
      <PageBreadcrumb title="DETALLE DE COMPRAS-CANJES-VENTAS POR SOCIO" subName="Ventas" />
      <Card>
        <Card.Body>
          <TabView>
            <TabPanel header={'CHANGE'}>
              <DataTableVentas id_empresa={598}/>
            </TabPanel>
            <TabPanel header={'HISTORICO'}>
              
            </TabPanel>
          </TabView>
        </Card.Body>
      </Card>
    </>
  )
}
