import { InputButton } from '@/components/InputText'
import React, { useState } from 'react'
import { DataTableGestionComercial } from './DataTableGestionComercial'
import { ModalCustomComercial } from './ModalCustomComercial'
import { ModalComentario } from './ModalComentario'
import { PageBreadcrumb } from '@/components'

export const AppGestionComercial = () => {
    const [isOpenModalGestionComercial, setisOpenModalGestionComercial] = useState({isOpen: false, id: 0, isCopy: false})
    const [isOpenModalComentario, setisOpenModalComentario] = useState({isOpen: false, uid: 0})
    const [isOpenModalVista, setisOpenModalVista] = useState({isOpen: false, uid: 0})
    const [isOpenModalHistory, setisOpenModalHistory] = useState({isOpen: false, uid: 0})
    const onOpenModalGestionComercial = (id, isCopy)=>{
        setisOpenModalGestionComercial({isOpen: true, id, isCopy})
    }
    const onCloseModalGestionComercial = ()=>{
        setisOpenModalGestionComercial({isOpen: false, id: 0, isCopy: false})
    }
    const onOpenModalComentario = (uid)=>{
        setisOpenModalComentario({isOpen: true, uid})
    }
    const onCloseModalComentario=()=>{
        setisOpenModalComentario({isOpen: false, uid: ''})
    }
    const onOpenModalVista = (uid)=>{
        setisOpenModalVista({isOpen: true, uid})
    }
    const onCloseModalVista=()=>{
        setisOpenModalVista({isOpen: false, uid: ''})
    }
    const onOpenModalHistory = (uid)=>{
        setisOpenModalHistory({isOpen: true, uid})
    }
    const onCloseModalHistory=()=>{
        setisOpenModalHistory({isOpen: false, uid: ''})
    }
  return (
    <div>
        <PageBreadcrumb title={'GESTION DE LEAD'}/>
        <InputButton label={'Agregar lead'} onClick={()=>onOpenModalGestionComercial(0, false)}/>
        <DataTableGestionComercial onOpenModalComentario={onOpenModalComentario} onOpenModalGestionComercial={onOpenModalGestionComercial}/>
        <ModalComentario onHide={onCloseModalComentario} show={isOpenModalComentario.isOpen} uid_comentario={isOpenModalComentario.uid}/>
        <ModalCustomComercial id={isOpenModalGestionComercial.id} show={isOpenModalGestionComercial.isOpen} onHide={onCloseModalGestionComercial} isCopy={isOpenModalGestionComercial.isCopy}/>
    </div>
  )
}
