import { InputButton } from '@/components/InputText'
import React, { useState } from 'react'
import { ModalCustomProveedores } from './ModalCustomProveedores'
import { DataTableGestionProveedores } from './DataTableGestionProveedores'

export const AppGestionProveedores = ({idEmpresa, tipo, estado}) => {
  const [isOpenModalCustomProveedores, setisOpenModalCustomProveedores] = useState({isOpen: false, id: 0, isCopy: false})
  const onOpenModalCustomProv = (id, isCopy)=>{
    setisOpenModalCustomProveedores({isOpen: true, id, isCopy})
  }
  const onCloseModalCustomProv = ()=>{
    setisOpenModalCustomProveedores({isOpen: false, id: 0, isCopy: false})
  }
  return (
    <div>
      <InputButton label={'AGREGAR PROVEEDOR'} onClick={()=>onOpenModalCustomProv(0, false)}/>
      <DataTableGestionProveedores onOpenModalCustomProv={onOpenModalCustomProv} estado={estado} id_empresa={idEmpresa} tipo={tipo}/>
      <ModalCustomProveedores 
          isCopy={isOpenModalCustomProveedores.isCopy} 
          estado={estado} 
          id_enterprice={idEmpresa} 
          tipo={tipo} 
          onHide={onCloseModalCustomProv} 
          id={isOpenModalCustomProveedores.id} 
          show={isOpenModalCustomProveedores.isOpen}
        />
    </div>
  )
}
