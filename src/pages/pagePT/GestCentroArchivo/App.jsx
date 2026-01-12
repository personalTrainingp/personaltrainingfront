import { PageBreadcrumb } from '@/components'
import React, { useState } from 'react'
import { ModalCustomArchivo } from './ModalCustom'
import { DataTable } from './DataTableCentroArchivo'
import { Button } from 'react-bootstrap'

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
    <PageBreadcrumb title={'CENTRO DE ARCHIVO'} />
    <Button onClick={onClickOpenModalCustomArchivo}>AGREGAR ARCHIVO</Button>
    <DataTable />
    <ModalCustomArchivo onHide={onClickCloseModalCustomArchivo}  show={isOpenModalCustomArchivo.isOpen}/>
    </>
  )
}
