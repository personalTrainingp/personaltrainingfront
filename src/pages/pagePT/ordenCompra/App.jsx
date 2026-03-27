import { PageBreadcrumb } from '@/components'
import { TabPanel, TabView } from 'primereact/tabview'
import React, { useRef } from 'react'
import { Card } from 'react-bootstrap'
import { Toast } from 'primereact/toast'
import { AppOrdenCompra } from './AppOrdenCompra'
import { ColorEmpresa } from '@/components/ColorEmpresa'

export const OrdenCompra = () => {
    const toast = useRef(null);
  return (
    <>
        <Toast ref={toast}/>
    <PageBreadcrumb title={'REGISTRO DE COMPRAS'} subName={'T'}/>
    <ColorEmpresa 
      childrenChange={
        <AppOrdenCompra id_empresa={598}/>
      }
    />
    </>
  )
}
