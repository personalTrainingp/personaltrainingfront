import React from 'react'
import { Card, Tab, Tabs } from 'react-bootstrap'
import { DataInventario } from './DataInventario'
import { PageBreadcrumb } from '@/components'
import { TabPanel, TabView } from 'primereact/tabview'

export const GestionInventario = () => {
  return (
    <>
    
    <PageBreadcrumb title={'INVENTARIOS'} subName={'T'}/>
    <Card className='p-4 m-2'>
    <TabView>
      <TabPanel header={'CHORRILLOS'}>
              <DataInventario id_enterprice={601}/>
      </TabPanel>
      <TabPanel header={'CIRCUS CO.'}>
              <DataInventario id_enterprice={602}/>
      </TabPanel>
    </TabView>
    </Card>
    </>
  )
}
