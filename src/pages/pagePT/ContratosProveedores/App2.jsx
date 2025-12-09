import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { ModalCustomProveedores } from './ModalCustomProveedores'
import { DataTableContratosProveedores } from './DataTableContratosProveedores'
import { PageBreadcrumb } from '@/components'

export const App2 = ({id_empresa}) => {
    const [isOpenModalContratoProveedores, setisOpenModalContratoProveedores] = useState({isOpen: false, id: 0, isCopy: false})
    const onOpenModalCustomContratosProv = (id, isCopy)=>{
        setisOpenModalContratoProveedores({isOpen:true, id, isCopy})
    }
    const onCloseModalCustomContratosProv = ()=>{
        setisOpenModalContratoProveedores({isOpen: false, id: 0,  isCopy: false})
    }
  return (
    <>
    <PageBreadcrumb title={'Contratos'}/>
    <Button onClick={()=>onOpenModalCustomContratosProv(0, false)}>Agregar Contrato</Button>
    <DataTableContratosProveedores id_empresa={id_empresa} onOpenModalCustomContratosProv={onOpenModalCustomContratosProv} />
    <ModalCustomProveedores id_empresa1={id_empresa} onHide={onCloseModalCustomContratosProv} show={isOpenModalContratoProveedores.isOpen} id={isOpenModalContratoProveedores.id} isCopy={isOpenModalContratoProveedores.isCopy}/>
    </>
  )
}
