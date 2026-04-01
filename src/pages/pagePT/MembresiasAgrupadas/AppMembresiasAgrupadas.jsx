import React, { useEffect, useState } from 'react'
import { DataTableMembresiasAgrupadas } from './DataTableMembresiasAgrupadas'
import { useMembresiasStore } from './useMembresiasStore'
import { PageBreadcrumb } from '@/components'
import { ModalDetalleProgramas } from './ModalDetalleProgramas'

export const AppMembresiasAgrupadas = () => {
    const { obtenerVentaMembresias, dataMembresias } = useMembresiasStore()
    const [isOpenModalDetalleProgramas, setisOpenModalDetalleProgramas] = useState({isOpen: false, detalle:[]})
    useEffect(() => {
        obtenerVentaMembresias()
    }, [])
    const onOpenModalDetalle = (detalle)=>{
      setisOpenModalDetalleProgramas({isOpen: true, detalle})
    }
    const onCloseModalDetalle = ()=>{
      setisOpenModalDetalleProgramas({isOpen: false})
    }
  return (
    <div>
        <PageBreadcrumb title={'LIFE TIME VALUE'}/>
        <DataTableMembresiasAgrupadas data={dataMembresias} onOpenModalDetalle={onOpenModalDetalle}/>
        <ModalDetalleProgramas onHide={onCloseModalDetalle} show={isOpenModalDetalleProgramas.isOpen} detalle={isOpenModalDetalleProgramas.detalle}/>
    </div>
  )
}
