import React from 'react'
import { Card, Tab, Tabs } from 'react-bootstrap'
import { DataInventario } from './DataInventario'
import { PageBreadcrumb } from '@/components'
import { TabPanel, TabView } from 'primereact/tabview'

export const GestionInventario = () => {
  return (
    <>
    
    <PageBreadcrumb title={'GESTION DE INVENTARIO'} subName={'T'}/>
    <Card className='p-4 m-2'>
      <TabView>
        <TabPanel header="CIRCUS">
              <DataInventario id_enterprice={599}/>
        </TabPanel>
        <TabPanel header="CHANGE">
              <DataInventario id_enterprice={598}/>
        </TabPanel>
        <TabPanel header="MANOJ">
              <DataInventario id_enterprice={600}/>
        </TabPanel>
        {/* <TabPanel header="CHANGE">
              <DataInventario id_enterprice={598}/>
        </TabPanel> */}
      </TabView>
    </Card>
    </>
  )
}
