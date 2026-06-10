import { PageBreadcrumb } from '@/components'
import { InputButton } from '@/components/InputText'
import React, { useState } from 'react'
import { ModalCustomGestionIgv } from './ModalCustomGestionIgv'

export const App = () => {
    const [isOpenModalIGV, setisOpenModalIGV] = useState({isOpen: false, id: 0})
    const onOpenModalIGV = (id)=>{
        setisOpenModalIGV({isOpen: true, id})
    }
    const onCloseModalIGV = ()=>{
        setisOpenModalIGV({isOpen: false, id: 0})
    }
  return (
    <div>
        <PageBreadcrumb title={'GESTION DE IGV'}/>
        <InputButton label={'Agregar IGV'} onClick={()=>onOpenModalIGV(0)}/>
        <ModalCustomGestionIgv id={isOpenModalIGV.id} show={isOpenModalIGV.isOpen} onHide={onCloseModalIGV}/>
    </div>
  )
}
