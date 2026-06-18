import { PageBreadcrumb } from '@/components'
import { TabPanel, TabView } from 'primereact/tabview'
import React, { useRef } from 'react'
import { Card } from 'react-bootstrap'
import { Toast } from 'primereact/toast'
import { AppOrdenCompra } from './AppOrdenCompra'
import { ColorEmpresa } from '@/components/ColorEmpresa'
import { DataTableIgv } from './DataTableIgv'

export const OrdenCompra = () => {
    const toast = useRef(null);
  return (
    <>
        <Toast ref={toast}/>
    <PageBreadcrumb title={'REGISTRO DE COMPRAS'} subName={'T'}/>
    <ColorEmpresa 
      childrenChange={
        <TabView>
          <TabPanel header='DATA'>
            <DataTableIgv id_facturado_por={598}/>
          </TabPanel>
          <TabPanel header='REPORTE'>
            <AppOrdenCompra id_empresa={598}/>
          </TabPanel>
        </TabView>
      }
    />
    </>
  )
}
