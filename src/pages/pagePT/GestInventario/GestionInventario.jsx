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
        {/* <TabPanel header="CIRCUS">
              <DataInventario id_enterprice={599}/>
        </TabPanel> */}
        <TabPanel header="CHANGE THE SLIM STUDIO">
              <DataInventario id_enterprice={598} id_zona={598}/>
        </TabPanel>
        <TabPanel header="MP">
              <DataInventario id_enterprice={600} id_zona={600}/>
        </TabPanel>
        <TabPanel header="CIRCUS SALON">
              <DataInventario id_enterprice={599} id_zona={599}/>
        </TabPanel>
        <TabPanel header="PROYECTO CIRCUS">
              <DataInventario id_enterprice={602} id_zona={599}/>
        </TabPanel>
        <TabPanel header="CIRCUS INFRAESTRUCTURA">
              <DataInventario id_enterprice={610} id_zona={599}/>
        </TabPanel>
        <TabPanel header="CHORRILLOS">
              <DataInventario id_enterprice={601} id_zona={601}/>
        </TabPanel>
      </TabView>
    </Card>
    </>
  )
}
