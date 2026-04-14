import { InputButton } from '@/components/InputText'
import React, { useState } from 'react'
import { DataTableGestionOperadoresPago } from './DataTableGestionOperadoresPago'
import { ModalCustomOperadoresPago } from './ModalCustomOperadoresPago'
import { PageBreadcrumb } from '@/components'

export const AppGestionOperadoresPago = () => {
    const [isOpenModalGestionOperadoresPago, setisOpenModalGestionOperadoresPago] = useState({isOpen: false, id: 0, isCopy: false})
    const onOpenModalGestionOperadoresPago = (id, isCopy)=>{
        setisOpenModalGestionOperadoresPago({isOpen: true, id, isCopy})
    }
    const onCloseModalGestionOperadoresPago = ()=>{
        setisOpenModalGestionOperadoresPago({isOpen: false, id: 0, isCopy: false})
    }
  return (
    <div>
        <PageBreadcrumb title={'GESTION DE OPERADORES'}/>
        <InputButton label={'Agregar Operadores Pago'} onClick={()=>onOpenModalGestionOperadoresPago(0, false)}/>
        <DataTableGestionOperadoresPago onOpenModalGestionOperadoresPago={onOpenModalGestionOperadoresPago}/>
        <ModalCustomOperadoresPago id={isOpenModalGestionOperadoresPago.id} show={isOpenModalGestionOperadoresPago.isOpen} onHide={onCloseModalGestionOperadoresPago} isCopy={isOpenModalGestionOperadoresPago.isCopy}/>
    </div>
  )
}
