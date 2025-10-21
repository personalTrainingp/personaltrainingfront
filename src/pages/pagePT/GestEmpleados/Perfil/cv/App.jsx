import { PageBreadcrumb } from '@/components'
import { Button } from 'primereact/button'
import React, { useState } from 'react'
import { ModalCustomArchivo } from './ModalCustomArchivo'
import { DataTable } from './DataTable'

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
    <PageBreadcrumb title={'cv colaboradores'} />
    {/* <Button label='Agregar archivo' onClick={onClickOpenModalCustomArchivo}/> */}
    <DataTable />
    <ModalCustomArchivo onHide={onClickCloseModalCustomArchivo}  show={isOpenModalCustomArchivo.isOpen}/>
    </>
  )
}
