import { PageBreadcrumb } from '@/components'
import { InputButton } from '@/components/InputText'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import { DataTableGestionEmpleados } from './DataTableGestionEmpleados'
import { ModalCustomEmpleado } from './ModalCustomEmpleado'
import { useEmpleadosStore } from './useEmpleadosStore'

export const ViewGestionEmpleados = ({id_empresa, id_estado}) => {
    const [isOpenModalCustomEmpleado, setisOpenModalCustomEmpleado] = useState({id: 0, isCopy: false, isOpen: false})
    const [editandoOrden, setEditandoOrden] = useState(false)
    const [ordenes, setOrdenes] = useState({})
    const [guardandoOrden, setGuardandoOrden] = useState(false)
    const { dataView } = useSelector(e=>e.COLABORADORES)
    const { actualizarOrdenEmpleados } = useEmpleadosStore()
    const onOpenModalCustomEmpleados = (id=0, isCopy=false)=>{
        setisOpenModalCustomEmpleado({id, isCopy, isOpen: true})
    }
    const onCloseModalCustomEmpleados = ()=>{
        setisOpenModalCustomEmpleado({id: 0, isCopy: false, isOpen: false})
    }
    const onChangeOrden = (id_empl, valor)=>{
        setOrdenes(prev=>({...prev, [id_empl]: valor}))
    }
    const onCancelarOrden = ()=>{
        setOrdenes({})
        setEditandoOrden(false)
    }
    const onGuardarOrden = async()=>{
        const cambios = Object.entries(ordenes)
            .map(([id, valor])=>({id: Number(id), orden: valor === '' ? null : Number(valor)}))
            .filter(({id, orden})=>(dataView.find(e=>e.id_empl === id)?.orden ?? null) !== orden)
        setGuardandoOrden(true)
        const guardado = await actualizarOrdenEmpleados(cambios, id_empresa, id_estado)
        setGuardandoOrden(false)
        if(!guardado){
            Swal.fire({
                icon: 'error',
                title: 'No se pudo guardar todo el orden',
                text: 'Revisa los valores e inténtalo de nuevo.',
            })
            return
        }
        onCancelarOrden()
    }
  return (
    <div>
        <PageBreadcrumb title={'Gestion de colaboradores'}/>
        <div className='d-flex flex-wrap gap-2'>
            <InputButton label={'AGREGAR COLABORADOR'} onClick={()=>onOpenModalCustomEmpleados(0, false)}/>
            {editandoOrden ? (
                <>
                    <InputButton label={guardandoOrden ? 'GUARDANDO...' : 'GUARDAR ORDEN'} onClick={onGuardarOrden} disabled={guardandoOrden}/>
                    <InputButton label={'CANCELAR'} variant={'outline-danger'} onClick={onCancelarOrden} disabled={guardandoOrden}/>
                </>
            ) : (
                <InputButton label={'CAMBIAR ORDEN'} onClick={()=>setEditandoOrden(true)}/>
            )}
        </div>
        <DataTableGestionEmpleados id_empresa={id_empresa} id_estado={id_estado} editandoOrden={editandoOrden} ordenes={ordenes} onChangeOrden={onChangeOrden}/>
        <ModalCustomEmpleado id_empresa={id_empresa} id_estado={id_estado} show={isOpenModalCustomEmpleado.isOpen} id={isOpenModalCustomEmpleado.id} isCopy={isOpenModalCustomEmpleado.isCopy} onHide={onCloseModalCustomEmpleados}/>
    </div>
  )
}
