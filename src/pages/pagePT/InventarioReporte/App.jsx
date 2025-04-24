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
        <TabPanel header='REDUCTO INVENTARIO TOTAL'>
            <InventarioTotalizado id_empresa={599} label_empresa={'REDUCTO INVENTARIO TOTAL'}/>
        </TabPanel>
        <TabPanel header='CIRCUS CO.'>
        <InventarioTotalizado  id_empresa={602} label_empresa={'CIRCUS CO.'}/>
        </TabPanel>
        <TabPanel header='REDUCTO INFRAESTRUCTURA'>
        <InventarioTotalizado id_empresa={610} label_empresa={'REDUCTO INFRAESTRUCTURA'}/>
        </TabPanel>
    </TabView>
    </>
  )
}
