import { PageBreadcrumb } from '@/components'
import { InputButton } from '@/components/InputText'
import React, { useState } from 'react'
import { DataTableGestionEmpleados } from './DataTableGestionEmpleados'
import { ModalCustomEmpleado } from './ModalCustomEmpleado'

export const ViewGestionEmpleados = ({id_empresa, id_estado}) => {
    const [isOpenModalCustomEmpleado, setisOpenModalCustomEmpleado] = useState({id: 0, isCopy: false, isOpen: false})
    const onOpenModalCustomEmpleados = (id=0, isCopy=false)=>{
        setisOpenModalCustomEmpleado({id, isCopy, isOpen: true})
    }
    const onCloseModalCustomEmpleados = ()=>{
        setisOpenModalCustomEmpleado({id: 0, isCopy: false, isOpen: false})
    }
  return (
    <div>
        <PageBreadcrumb title={'Gestion de colaboradores'}/>
        <InputButton label={'AGREGAR COLABORADOR'} onClick={()=>onOpenModalCustomEmpleados(0, false)}/>
        <DataTableGestionEmpleados id_empresa={id_empresa} id_estado={id_estado}/>
        <ModalCustomEmpleado show={isOpenModalCustomEmpleado.isOpen} id={isOpenModalCustomEmpleado.id} isCopy={isOpenModalCustomEmpleado.isCopy} onHide={onCloseModalCustomEmpleados}/>
    </div>
  )
}
