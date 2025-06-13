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
              <GestionGastosIngresos id_enterprice={599} bgEmpresa={'bg-danger'}/>
        </TabPanel>
        <TabPanel header="SAN EXPEDITO">
              <GestionGastosIngresos id_enterprice={601} bgEmpresa={'bg-danger'}/>
        </TabPanel>
        <TabPanel header="CHANGE">
              <GestionGastosIngresos id_enterprice={598} bgEmpresa={'bg-danger'}/>
        </TabPanel>
        <TabPanel header="OTROS">
              <GestionGastosIngresos id_enterprice={0} bgEmpresa={'bg-danger'}/>
        </TabPanel>
        <TabPanel header="RAL">
              <GestionGastosIngresos id_enterprice={600} bgEmpresa={'bg-danger'}/>
        </TabPanel>
      </TabView>
    </Card>
    </>
  )
}
