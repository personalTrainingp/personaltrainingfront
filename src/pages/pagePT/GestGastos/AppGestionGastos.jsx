import { InputButton } from '@/components/InputText'
import React, { useState } from 'react'
import { DataTableGastos } from './DataTableGastos'
import { ModalCustomGasto } from './ModalCustomGasto'

export const AppGestionGastos = ({id_empresa}) => {
  const [isOpenModalGasto, setisOpenModalGasto] = useState({id: 0, isOpen: false, isCopy: false})
  const onOpenModalGasto = (id, isCopy)=>{
    setisOpenModalGasto({id, isOpen: true, isCopy})
  }
  const onCloseModalGasto = ()=>{
    setisOpenModalGasto({id: 0, isOpen: false, isCopy: false})
  }
  return (
    <div>
      <InputButton label={'AGREGAR GASTO'} onClick={()=>onOpenModalGasto(0, false)}/>
      <DataTableGastos id_empresa={id_empresa} onOpenModalGasto={onOpenModalGasto}/>
      <ModalCustomGasto onOpenModalGasto={onOpenModalGasto} id_enterprice={id_empresa} id={isOpenModalGasto.id} isCopy={isOpenModalGasto.isCopy} onHide={onCloseModalGasto} show={isOpenModalGasto.isOpen}/>
    </div>
  )
}
