import { InputButton } from '@/components/InputText'
import React, { useState } from 'react'
import { DataTableTc } from './DataTableTc'
import { ModalTc } from './ModalTc'

export const AppTc = () => {
    const [isOpenModalTC, setisOpenModalTC] = useState({isOpen: false, id: 0})
    const onOpenModalTC = (id)=>{
        setisOpenModalTC({isOpen: true, id})
    }
    const onCloseModalTC = ()=>{
        setisOpenModalTC({isOpen: false, id: 0})
    }
  return (
    <div>
        <InputButton label={'Agregar TC'} onClick={()=>onOpenModalTC(0)}/>
        <DataTableTc/>
        <ModalTc />
    </div>
  )
}
