import { PageBreadcrumb } from '@/components'
import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { DataTableCentroArchivo } from './DataTableCentroArchivo'
import { ModalCustom } from './ModalCustom'

export const App2 = ({idEmpresa}) => {
    const [isOpenModalCustomArchivo, setisOpenModalCustomArchivo] = useState({isOpen: false, id: 0})
    const onClickOpenModalCustomArchivo=(id=0)=>{
        setisOpenModalCustomArchivo({isOpen: true, id: id})
    }
    const onClickCloseModalCustomArchivo =()=>{
        setisOpenModalCustomArchivo({isOpen: false, id: 0})
    }   
  return (
    <>
    <Button onClick={()=>onClickOpenModalCustomArchivo(0)}>AGREGAR ARCHIVO</Button>
    <DataTableCentroArchivo onClickOpenModalCustomArchivo={onClickOpenModalCustomArchivo} idEmpresa={idEmpresa}/>
    <ModalCustom id={isOpenModalCustomArchivo.id} onHide={onClickCloseModalCustomArchivo}  show={isOpenModalCustomArchivo.isOpen}/>
    </>
  )
}
