import { InputButton } from '@/components/InputText'
import React, { useState } from 'react'
import { DataTableTerminologiaSistema } from '../DataTableTerminologiaSistema'
import { ModalCustomTermSistema } from '../ModalCustomTermSistema'

export const ViewTerminos = ({grupo, entidad, titulo}) => {
  const [isOpenModalTermSis, setisOpenModalTermSis] = useState({isOpen: false, id: 0})
  const onOpenModalTermSis = (id)=>{
    setisOpenModalTermSis({isOpen: true, id})
  }
  const onCloseModalTermSis = ()=>{
    setisOpenModalTermSis({isOpen: false, id:0})
  }
  return (
    <div>
        <InputButton label={`AGREGAR ${titulo}`} onClick={()=>onOpenModalTermSis(0)}/>
        <DataTableTerminologiaSistema titulo={titulo} grupo={grupo} entidad={entidad} onOpenModalTermSis={onOpenModalTermSis}/>
        <ModalCustomTermSistema show={isOpenModalTermSis.isOpen} onHide={onCloseModalTermSis} id={isOpenModalTermSis.id} entidad={entidad} grupo={grupo} />
    </div>
  )
}
