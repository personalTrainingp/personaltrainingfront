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
              <DataInventario id_enterprice={598} flag={true} id_zona={598}/>
        </TabPanel>
        <TabPanel header="MP">
              <DataInventario id_enterprice={600} flag={true} id_zona={600}/>
        </TabPanel>
        <TabPanel header="CIRCUS SALON">
              <DataInventario id_enterprice={599} flag={true} id_zona={599}/>
        </TabPanel>
        <TabPanel header="PROYECTO CIRCUS">
              <DataInventario id_enterprice={602}  flag={true} id_zona={599}/>
        </TabPanel>
        <TabPanel header="PROYECTO CIRCUS - VACIO">
              <DataInventario id_enterprice={602} flag={false} id_zona={599}/>
        </TabPanel>
        <TabPanel header="CHORRILLOS">
              <DataInventario id_enterprice={601} flag={true} id_zona={601}/>
        </TabPanel>
      </TabView>
    </Card>
    </>
  )
}
