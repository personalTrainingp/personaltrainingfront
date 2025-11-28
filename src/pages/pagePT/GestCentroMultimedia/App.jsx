import { PageBreadcrumb } from '@/components'
import React, { useState } from 'react'
import { ModalCustomArchivo } from './ModalCustomArchivo'
import { DataTable } from './DataTable'
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
