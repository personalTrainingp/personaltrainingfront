import React from 'react'
import { Card, Tab, Tabs } from 'react-bootstrap'
import { DataInventario } from './DataInventario'
import { PageBreadcrumb } from '@/components'
import { TabPanel, TabView } from 'primereact/tabview'

export const GestionInventario = () => {
  return (
    <>
    
    <PageBreadcrumb title={'INVENTARIO DE CHORRILLOS'} subName={'T'}/>
    <Card className='p-4 m-2'>
              <DataInventario id_enterprice={601}/>
    </Card>
    </>
  )
}
