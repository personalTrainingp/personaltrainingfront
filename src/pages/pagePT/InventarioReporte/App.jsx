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
        <TabPanel header={<h2 className='card p-4 mb-0'>CHANGE THE SLIM STUDIO</h2>}>
            <InventarioTotalizado id_empresa={598} label_empresa={'CHANGE THE SLIM STUDIO'}/>
        </TabPanel>
        <TabPanel header={<h2 className='card p-4 mb-0'>REDUCTO INVENTARIO TOTAL</h2>}>
            <InventarioTotalizado id_empresa={599} label_empresa={'REDUCTO INVENTARIO TOTAL'}/>
        </TabPanel>
        <TabPanel header={<h2 className='card p-4 mb-0'>CIRCUS CO.</h2>}>
        <InventarioTotalizado  id_empresa={602} label_empresa={'CIRCUS CO.'}/>
        </TabPanel>
        <TabPanel header={<h2 className='card p-4 mb-0'>REDUCTO INFRAESTRUCTURA</h2>}>
        <InventarioTotalizado id_empresa={610} label_empresa={'REDUCTO INFRAESTR.'}/>
        </TabPanel>
    </TabView>
    </>
  )
}
