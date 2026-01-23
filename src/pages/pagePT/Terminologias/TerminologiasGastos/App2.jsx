import { InputButton } from '@/components/InputText'
import React, { useState } from 'react'
import { DataTableTermGastos } from './DataTableTermGastos'
import { ModalCustomTermGastos } from './ModalCustomTermGastos'

export const App2 = ({id_empresa, tipo}) => {
    const [isOpenModalCustomTermGastos, setisOpenModalCustomTermGastos] = useState({isOpen: false, id: 0})
    const onOpenModalCustomTermGastos=async(id)=>{
        setisOpenModalCustomTermGastos({isOpen: true, id})
    }
    const onCloseModalCustomTermGastos= ()=>{
        setisOpenModalCustomTermGastos({isOpen: false, id: 0})
    }
  return (
    <div>
        <InputButton onClick={()=>onOpenModalCustomTermGastos(0)} label={'Agregar terminologia'}/>
        <DataTableTermGastos/>
        <ModalCustomTermGastos id_empresa={id_empresa} tipo={tipo} id={isOpenModalCustomTermGastos.id} show={isOpenModalCustomTermGastos.isOpen} onHide={onCloseModalCustomTermGastos}/>
    </div>
  )
}
