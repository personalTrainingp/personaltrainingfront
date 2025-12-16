import React, { useState } from 'react'
import { ModalCustomProducto } from './ModalCustomProducto'
import { DataTableProductos } from './DataTableProductos'
import { InputButton } from '@/components/InputText'

export const App = () => {
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
        <DataTableProductos/>
        <ModalCustomProducto show={isOpenModalCustomProductos.isOpen} onHide={onCloseModalCustomProducto}/>
    </div>
  )
}
