import { PageBreadcrumb } from '@/components'
import React, { useState } from 'react'
import { DataTableArticulos } from './DataTableArticulos'
import { ModalCustomArticulo } from './ModalCustomArticulo'
import { Button } from 'react-bootstrap'

export const App = () => {
    const [isOpenModalCustomArticulo, setisOpenModalCustomArticulo] = useState({isOpen: false, id: 0})
    const onOpenModalCustomArticulo=(id)=>{
        setisOpenModalCustomArticulo({id, isOpen: true})
    }
    const onCloseModalCustomArticulo=()=>{
        setisOpenModalCustomArticulo({id: 0, isOpen: false})
    }
  return (
    <>
    <PageBreadcrumb title={'GESTION DE INVENTARIO'} subName={'T'}/>
    <Button className='' onClick={()=>onOpenModalCustomArticulo(0)}>AGREGAR ARTICULO</Button>
    <DataTableArticulos onOpenModalCustomArticulo={onOpenModalCustomArticulo}/>
    <ModalCustomArticulo id={isOpenModalCustomArticulo.id} onHide={onCloseModalCustomArticulo} show={isOpenModalCustomArticulo.isOpen}/>
    </>
  )
}