import { PageBreadcrumb } from '@/components'
import { TabPanel, TabView } from 'primereact/tabview'
import React from 'react'
import { InventarioTotalizado } from './InventarioTotalizado'
import { useDispatch, useSelector } from 'react-redux'
import { onSetRangeDate } from '@/store/data/dataSlice'

export const App = () => {
  const {viewSubTitle} = useSelector(d=>d.ui)
  const dispatch = useDispatch()
          dispatch(onSetRangeDate(['AL', new Date()]))
  return (
    <>
    <PageBreadcrumb title={'INVENTARIO VALORIZADO POR ZONA'} topTitle={<h1 style={{fontSize: '37px', color: 'black'}}>{viewSubTitle}</h1>} subName={''}/>
    <TabView>
        <TabPanel header='CHANGE THE SLIM STUDIO'>
            <InventarioTotalizado id_empresa={598} label_empresa={'CHANGE THE SLIM STUDIO'}/>
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
