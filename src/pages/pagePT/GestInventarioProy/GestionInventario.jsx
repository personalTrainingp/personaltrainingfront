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
        <TabPanel header="CIRCUS SALON">
              <DataInventario id_enterprice={599}  id_zona={599}/>
        </TabPanel>
        <TabPanel header="CIRCUS CO.">
              <DataInventario id_enterprice={602} id_zona={599}/>
        </TabPanel>
      </TabView>
    </Card>
    </>
  )
}
