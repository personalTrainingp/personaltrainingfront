import { InputButton } from '@/components/InputText'
import React, { useState } from 'react'
import { DataTableCuentasBalances } from './DataTableCuentasBalances'
import { ModalCustomCuentasBalances } from './ModalCustomCuentasBalances'

export const App2 = ({idEmpresa, tipo, headerTipo}) => {
    const [isOpenModalCustomCuentasBalances, setisOpenModalCustomCuentasBalances] = useState({isOpen: false, id: 0, isCopy: false})
    const onOpenModalCustomCuentasBalances = (id=0, isCopy=false)=>{
        setisOpenModalCustomCuentasBalances({isOpen: true, id, isCopy})
    }
    const onCloseModalCustomCuentasBalances = ()=>{
        setisOpenModalCustomCuentasBalances({isOpen: false, id: 0, isCopy: false})
    }
  return (
    <div>
        <InputButton label={`Agregar cuenta ${headerTipo}`} onClick={()=>onOpenModalCustomCuentasBalances(0)}/>
        <DataTableCuentasBalances headerTipo={headerTipo} tipo={tipo} idEmpresa={idEmpresa} onOpenModalCustomCuentasBalances={onOpenModalCustomCuentasBalances}/>
        <ModalCustomCuentasBalances headerTipo={headerTipo} tipo={tipo} idEmpresa={idEmpresa} isCopy={isOpenModalCustomCuentasBalances.isCopy} id={isOpenModalCustomCuentasBalances.id} onHide={onCloseModalCustomCuentasBalances} show={isOpenModalCustomCuentasBalances.isOpen}/>
    </div>
  )
}
