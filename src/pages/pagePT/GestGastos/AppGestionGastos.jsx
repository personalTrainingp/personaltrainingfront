import { InputButton } from '@/components/InputText'
import React, { useState } from 'react'
import { DataTableGastos } from './DataTableGastos'
import { ModalCustomGasto } from './ModalCustomGasto'
import { ModalCustomProveedores } from '../GestProveedores/ModalCustomProveedores'

export const AppGestionGastos = ({id_empresa}) => {
  const [isOpenModalGasto, setisOpenModalGasto] = useState({id: 0, isOpen: false, isCopy: false})
  const [isOpenModalCustomProv, setisOpenModalCustomProv] = useState({id: 0, isOpen: false})
  const onOpenModalGasto = (id, isCopy)=>{
    setisOpenModalGasto({id, isOpen: true, isCopy})
  }
  const onCloseModalGasto = ()=>{
    setisOpenModalGasto({id: 0, isOpen: false, isCopy: false})
  }
  const onOpenModalProveedor = ()=>{
    setisOpenModalCustomProv({id: 0, isOpen: true})
    setisOpenModalGasto({id: 0, isOpen: false, isCopy: false})
  }
  return (
    <div>
      <InputButton label={'AGREGAR GASTO'} onClick={()=>onOpenModalGasto(0, false)}/>
      <DataTableGastos id_empresa={id_empresa} onOpenModalGasto={onOpenModalGasto}/>
      <ModalCustomGasto onOpenModalProveedor={onOpenModalProveedor} onOpenModalGasto={onOpenModalGasto} id_enterprice={id_empresa} id={isOpenModalGasto.id} isCopy={isOpenModalGasto.isCopy} onHide={onCloseModalGasto} show={isOpenModalGasto.isOpen}/>
      <ModalCustomProveedores onCloseModalProvPst={()=>onOpenModalGasto(0, false)} onHide={()=>setisOpenModalCustomProv({id: 0, isOpen: false})} show={isOpenModalCustomProv.isOpen} estado={true} id_enterprice={id_empresa} onShow={onOpenModalProveedor} tipo={1573} id={0}  />
    </div>
  )
}
