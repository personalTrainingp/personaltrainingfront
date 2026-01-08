import { InputButton } from '@/components/InputText'
import React, { useState } from 'react'
import { DataTableCuentasBalances } from './DataTableCuentasBalances'

export const App2 = ({idEmpresa}) => {
    const [isOpenModalCustom, setisOpenModalCustom] = useState({isOpen: false, id: 0})
    const onOpenModalCustom = (id)=>{
        setisOpenModalCustom({isOpen: true, id})
    }
    const onCloseModalCustom = ()=>{
        setisOpenModalCustom({isOpen: false, id: 0})
    }
  return (
    <div>
        <InputButton label={'Agregar cuenta'} onClick={()=>onOpenModalCustom(0)}/>
        <DataTableCuentasBalances idEmpresa={idEmpresa} onOpenModalCustom={onOpenModalCustom}/>
    </div>
  )
}
