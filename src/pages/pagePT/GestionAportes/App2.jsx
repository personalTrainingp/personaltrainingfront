import React, { useState } from 'react'
import { ModalCustomAporte } from './ModalCustomAporte'
import { InputButton } from '@/components/InputText'
import { DataTableAportes } from './DataTableAportes'
export const App2 = ({idEmpresa}) => {
    const [isOpenModalCustomAporte, setisOpenModalCustomAporte] = useState({isOpen: false, isCopy: false, id: 0})
    const onOpenModalCustomAporte = (id=0, isCopy)=>{
        setisOpenModalCustomAporte({isOpen: true, isCopy, id})
    }
    const onCloseModalCustomAporte = ()=>{
        setisOpenModalCustomAporte({isOpen: false, isCopy: false, id: 0})
    }
  return (
    <div>
        <InputButton label={'AGREGAR INGRESOS'} onClick={()=>onOpenModalCustomAporte(0, false)}/>
        <DataTableAportes idEmpresa={idEmpresa} onOpenModalCustomAporte={onOpenModalCustomAporte}/>
        <ModalCustomAporte isCopy={isOpenModalCustomAporte.isCopy} id={isOpenModalCustomAporte.id} idEmpresa={idEmpresa} onHide={onCloseModalCustomAporte} show={isOpenModalCustomAporte.isOpen}/>
    </div>
  )
}
