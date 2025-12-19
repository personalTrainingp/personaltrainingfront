import React, { useState } from 'react'
import { ModalCustomAporte } from './ModalCustomAporte'
import { InputButton } from '@/components/InputText'
import { DataTableAportes } from './DataTableAportes'
export const App2 = ({idEmpresa}) => {
    const [isOpenModalCustomAporte, setisOpenModalCustomAporte] = useState({isOpen: false, id: 0})
    const onOpenModalCustomAporte = (id=0)=>{
        setisOpenModalCustomAporte({isOpen: true, id})
    }
    const onCloseModalCustomAporte = ()=>{
        setisOpenModalCustomAporte({isOpen: false, id: 0})
    }
  return (
    <div>
        <InputButton label={'AGREGAR APORTE'} onClick={()=>onOpenModalCustomAporte(0)}/>
        <DataTableAportes idEmpresa={idEmpresa}/>
        <ModalCustomAporte id={isOpenModalCustomAporte.id} idEmpresa={idEmpresa} onHide={onCloseModalCustomAporte} show={isOpenModalCustomAporte.isOpen}/>
    </div>
  )
}
