import { PageBreadcrumb } from '@/components'
import { Button } from 'primereact/button'
import React, { useState } from 'react'
import { ModalCustomArchivo } from './ModalCustomArchivo'
import { DataTable } from './DataTable'
import { TabPanel, TabView } from 'primereact/tabview'

export const App = () => {
    const [isOpenModalCustomArchivo, setisOpenModalCustomArchivo] = useState({isOpen: false})
    const onClickOpenModalCustomArchivo=()=>{
        setisOpenModalCustomArchivo({isOpen: true})
    }
    const onClickCloseModalCustomArchivo =()=>{
        setisOpenModalCustomArchivo({isOpen: false})
    }
  return (
    <>
    <PageBreadcrumb title={'dni colaboradores'} />
      <TabView>
    <TabPanel header={'CHANGE'}>
        <Button label='Agregar archivo' onClick={onClickOpenModalCustomArchivo}/>
        <DataTable id_empresa={598}/>
    </TabPanel>
      </TabView>
        <ModalCustomArchivo onHide={onClickCloseModalCustomArchivo}  show={isOpenModalCustomArchivo.isOpen}/>
    </>
  )
}
