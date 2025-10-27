import { Button } from 'primereact/button'
import React, { useState } from 'react'
import { ModalCustomAlertasUsuarios } from './ModalCustomAlertasUsuarios'
import { PageBreadcrumb } from '@/components'
import { ViewDataTable } from './ViewDataTable'

export const  App = () => {
    const [isOpenCustomAlertaUsuario, setisOpenCustomAlertaUsuario] = useState({isOpen: false, id: 0})
    const onOpenModalCustomAlertaUsuario = (id)=>{
        setisOpenCustomAlertaUsuario({isOpen: true, id})
    }
    const onCloseModalCustomAlertaUsuario = ()=>{
        setisOpenCustomAlertaUsuario({isOpen: false, id: 0})
    }
  return (
    <div>
      <PageBreadcrumb title={'Gestion de alertas de usuario'}/>
        <Button label='Agregar nuevo' onClick={()=>onOpenModalCustomAlertaUsuario(0)}/>
          <ViewDataTable
          
          />
            <ModalCustomAlertasUsuarios onHide={onCloseModalCustomAlertaUsuario} id={isOpenCustomAlertaUsuario.id} show={isOpenCustomAlertaUsuario.isOpen}/>
    </div>
  )
}
