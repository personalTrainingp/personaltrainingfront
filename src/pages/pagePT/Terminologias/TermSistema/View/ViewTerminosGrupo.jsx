import { InputButton } from '@/components/InputText'
import React, { useState } from 'react'
import { ModalCustomTermSistema } from '../ModalCustomTermSistema'
import { DataTableTerminologiagrupo } from '../DataTableTerminologiagrupo'
import { ModalCustomTermGrupo } from '../ModalCustomTermGrupo'

export const ViewTerminosGrupo = ({titulo, id_empresa}) => {
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
        <DataTableTerminologiagrupo id_empresa={id_empresa}  titulo={titulo} onOpenModalTermSis={onOpenModalTermSis}/>
        <ModalCustomTermGrupo id_empresa={id_empresa} show={isOpenModalTermSis.isOpen} onHide={onCloseModalTermSis} id={isOpenModalTermSis.id} />
    </div>
  )
}
