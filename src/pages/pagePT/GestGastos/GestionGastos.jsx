import React from 'react'
import { Card, Tab, Tabs } from 'react-bootstrap'
import { GestionGastosIngresos } from './GestionGastosIngresos'
import { PageBreadcrumb } from '@/components'
import { TabPanel, TabView } from 'primereact/tabview'

export const GestionGastos = () => {
  return (
    <>
    
    <PageBreadcrumb title={'GESTION DE EGRESOS'} subName={'T'}/>
    <Card className='p-4 m-2'>
      <TabView>
        <TabPanel header="CIRCUS">
              <GestionGastosIngresos id_enterprice={599}/>
        </TabPanel>
        <TabPanel header="CHANGE">
              <GestionGastosIngresos id_enterprice={598}/>
        </TabPanel>
        <TabPanel header="OTROS">
              <GestionGastosIngresos id_enterprice={0}/>
        </TabPanel>
      </TabView>
    </Card>
    </>
  )
}
