import { PageBreadcrumb } from '@/components'
import { TabPanel, TabView } from 'primereact/tabview'
import React from 'react'
import { InventarioTotalizado } from './InventarioTotalizado'

export const App = () => {
  return (
    <>
    <PageBreadcrumb title={'INVENTARIO VALORIZADO DE ACTIVOS POR ZONA'} subName={'T'}/>
    <TabView>
        <TabPanel header='CHANGE THE SLIM STUDIO'>
            <InventarioTotalizado id_empresa={598} label_empresa={'CHANGE'}/>
        </TabPanel>
        <TabPanel header='CIRCUS'>
            <InventarioTotalizado id_empresa={599} label_empresa={'CIRCUS'}/>
        </TabPanel>
        <TabPanel header='PROYECTO CIRCUS'>
        <InventarioTotalizado  id_empresa={602} label_empresa={'PROYECTO CIRCUS'}/>
        </TabPanel>
        <TabPanel header='CIRCUS INFRAESTRUCTURA'>
        <InventarioTotalizado id_empresa={610} label_empresa={'CIRCUS INFRAESTRUCTURA'}/>
        </TabPanel>
    </TabView>
    </>
  )
}
