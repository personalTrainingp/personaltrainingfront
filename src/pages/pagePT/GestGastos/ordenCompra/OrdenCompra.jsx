import { PageBreadcrumb } from '@/components'
import { TabPanel, TabView } from 'primereact/tabview'
import React, { useRef } from 'react'
import { Card } from 'react-bootstrap'
import DataOrdenCompra from './DataOrdenCompra'
import { Toast } from 'primereact/toast'

export const OrdenCompra = () => {
    const toast = useRef(null);
    const showToast = (dataToast) => {
      toast.current.show(dataToast);
    };
  return (
    <>
        <Toast ref={toast}/>
    <PageBreadcrumb title={'REGISTRO DE COMPRA'} subName={'T'}/>
    <Card className='p-4 m-2'>
      <TabView>
        <TabPanel header="CIRCUS">
              <DataOrdenCompra showToast={showToast} id_enterprice={599}/>
        </TabPanel>
        <TabPanel header="CHANGE">
              <DataOrdenCompra id_enterprice={598} showToast={showToast}/>
        </TabPanel>
        <TabPanel header="OTROS">
              <DataOrdenCompra id_enterprice={0} showToast={showToast}/>
        </TabPanel>
      </TabView>
    </Card>
    </>
  )
}
