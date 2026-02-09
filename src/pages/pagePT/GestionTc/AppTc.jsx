import { InputButton } from '@/components/InputText'
import React, { useState } from 'react'
import { DataTableTc } from './DataTableTc'
import { ModalTc } from './ModalTc'
import { PageBreadcrumb } from '@/components'

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
        <PageBreadcrumb title={'GESTION DE TC'}/>
        <InputButton label={'Agregar TC'} onClick={()=>onOpenModalTC(0)}/>
        <DataTableTc onOpenModalTC={onOpenModalTC}/>
        <ModalTc show={isOpenModalTC.isOpen} onHide={onCloseModalTC} id={isOpenModalTC.id}/>
    </div>
  )
}
