import React, { useState } from 'react'
import { ModalCustomProducto } from './ModalCustomProducto'
import { DataTableProductos } from './DataTableProductos'
import { InputButton } from '@/components/InputText'

export const App2 = ({idEmpresa}) => {
    const [isOpenModalCustomProductos, setisOpenModalCustomProductos] = useState({isOpen: false, id: 0})
    const onOpenModalCustomProducto = (id)=>{
        setisOpenModalCustomProductos({id, isOpen: true})
    }
    const onCloseModalCustomProducto = ()=>{
        setisOpenModalCustomProductos({id: 0, isOpen: false})
    }
    return (
    <div>
        <InputButton label={'AGREGAR PRODUCTO'} onClick={()=>onOpenModalCustomProducto(0)} />
        <DataTableProductos idEmpresa={idEmpresa} />
        <ModalCustomProducto idEmpresa={idEmpresa} show={isOpenModalCustomProductos.isOpen} onHide={onCloseModalCustomProducto} id={isOpenModalCustomProductos.id}/>
    </div>
  )
}
