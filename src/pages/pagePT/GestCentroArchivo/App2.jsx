import { PageBreadcrumb } from '@/components'
import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { DataTableCentroArchivo } from './DataTableCentroArchivo'
import { ModalCustom } from './ModalCustom'

export const App2 = ({idEmpresa}) => {
    const [isOpenModalCustomArchivo, setisOpenModalCustomArchivo] = useState({isOpen: false})
    const onClickOpenModalCustomArchivo=()=>{
        setisOpenModalCustomArchivo({isOpen: true})
    }
    const onClickCloseModalCustomArchivo =()=>{
        setisOpenModalCustomArchivo({isOpen: false})
    }   
  return (
    <>
    <Button onClick={onClickOpenModalCustomArchivo}>AGREGAR ARCHIVO</Button>
    <DataTableCentroArchivo idEmpresa={idEmpresa}/>
    <ModalCustom onHide={onClickCloseModalCustomArchivo}  show={isOpenModalCustomArchivo.isOpen}/>
    </>
  )
}
