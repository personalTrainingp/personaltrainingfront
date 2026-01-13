import { PageBreadcrumb } from '@/components'
import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { DataTableCentroArchivo } from './DataTableCentroArchivo'
import { ModalCustom } from './ModalCustom'

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
    <DataTableCentroArchivo />
    <ModalCustom onHide={onClickCloseModalCustomArchivo}  show={isOpenModalCustomArchivo.isOpen}/>
    </>
  )
}
