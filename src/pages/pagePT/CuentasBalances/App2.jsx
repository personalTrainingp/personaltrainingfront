import { InputButton } from '@/components/InputText'
import React, { useState } from 'react'
import { DataTableCuentasBalances } from './DataTableCuentasBalances'
import { ModalCustomCuentasBalances } from './ModalCustomCuentasBalances'

export const App2 = ({idEmpresa, tipo, headerTipo}) => {
    const [isOpenModalCustomCuentasBalances, setisOpenModalCustomCuentasBalances] = useState({isOpen: false, id: 0})
    const onOpenModalCustomCuentasBalances = (id)=>{
        setisOpenModalCustomCuentasBalances({isOpen: true, id})
    }
    const onCloseModalCustomCuentasBalances = ()=>{
        setisOpenModalCustomCuentasBalances({isOpen: false, id: 0})
    }
  return (
    <div>
        <InputButton label={`Agregar cuenta ${headerTipo}`} onClick={()=>onOpenModalCustomCuentasBalances(0)}/>
        <DataTableCuentasBalances headerTipo={headerTipo} tipo={tipo} idEmpresa={idEmpresa} onOpenModalCustomCuentasBalances={onOpenModalCustomCuentasBalances}/>
        <ModalCustomCuentasBalances headerTipo={headerTipo} tipo={tipo} idEmpresa={idEmpresa} id={isOpenModalCustomCuentasBalances.id} onHide={onCloseModalCustomCuentasBalances} show={isOpenModalCustomCuentasBalances.isOpen}/>
    </div>
  )
}
