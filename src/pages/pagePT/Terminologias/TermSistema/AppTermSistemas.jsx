import { InputButton } from '@/components/InputText'
import React, { useState } from 'react'
import { DataTableTerminologiaSistema } from './DataTableTerminologiaSistema'
import { PageBreadcrumb } from '@/components'
import { ModalCustomTermSistema } from './ModalCustomTermSistema'

export const AppTermSistemas = () => {
  const [isOpenModalTermSis, setisOpenModalTermSis] = useState({isOpen: false, id: 0})
  const onOpenModalTermSis = (id)=>{
    setisOpenModalTermSis({isOpen: true, id})
  }
  const onCloseModalTermSis = ()=>{
    setisOpenModalTermSis({isOpen: false, id:0})
  }
  return (
    <div>
      <PageBreadcrumb title={'TERM. SISTEMAS'}/>
        <InputButton label={'AGREGAR TERMINOLOGIA'} onClick={()=>onOpenModalTermSis(0)}/>
        <DataTableTerminologiaSistema onOpenModalTermSis={onOpenModalTermSis}/>
        <ModalCustomTermSistema show={isOpenModalTermSis.isOpen} onHide={onCloseModalTermSis} id={isOpenModalTermSis.id} />
    </div>
  )
}
