import { Button } from 'primereact/button'
import React, { useState } from 'react'
import { ModalCustom } from './ModalCustom'
import { DataTable } from './DataTable'

export const App = ({uid_contactsEmergencia}) => {
    const [isOpenModalCustomPariente, setisOpenModalCustomPariente] = useState({isOpen: false, id: 0})
    const onOpenModalCustomPariente = (id=0)=>{
        setisOpenModalCustomPariente({isOpen: true, id})
    }
    const onCloseModalCustomPariente = ()=>{
        setisOpenModalCustomPariente({isOpen: false, id: 0})
    }
  return (
    <div>
        <Button label='AGREGAR PARIENTE' onClick={()=>onOpenModalCustomPariente(0)}/>
        <DataTable entidad={'EMPLEADO'}  uid_contactoEmergencia={uid_contactsEmergencia} onOpenModalCustomPariente={onOpenModalCustomPariente}/>
        <ModalCustom uid_contactsEmergencia={uid_contactsEmergencia} id={isOpenModalCustomPariente.id} show={isOpenModalCustomPariente.isOpen} onHide={onCloseModalCustomPariente}/>
    </div>
  )
}
