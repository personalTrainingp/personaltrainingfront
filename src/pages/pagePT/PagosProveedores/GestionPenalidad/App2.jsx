import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { DataTablePenalidad } from './DataTablePenalidad'
import { ModalCustomPenalidad } from './ModalCustomPenalidad'
import { usePenalidadStore } from './usePenalidadStore'
import { useSelector } from 'react-redux'

export const App2 = ({idContrato, totalPenalidades, classNameTablePrincipal, fmt}) => {
    const [isOpenCustomPenalidad, setisOpenCustomPenalidad] = useState({isOpen: false, id: 0})
    const { obtenerPenalidadesxIDCONTRATO } = usePenalidadStore()
    const { dataView } = useSelector(e=>e.PENALIDAD)
    const onOpenModalCustomPenalidad = (id=0)=>{
        setisOpenCustomPenalidad({isOpen: true, id})
    }
    const onCloseModalCustomPenalidad = ()=>{
        setisOpenCustomPenalidad({isOpen: false, id: 0})
    }
    useEffect(() => {
      obtenerPenalidadesxIDCONTRATO(idContrato)
    }, [idContrato])
    
  return (
    <>
        <Button onClick={()=>onOpenModalCustomPenalidad(0)}>Agregar penalidad</Button>
        <DataTablePenalidad fmt={fmt} dataView={dataView?.filter(e=>e.id_contrato===idContrato)} classNameTablePrincipal={classNameTablePrincipal} totalPenalidades={totalPenalidades}/>
        <ModalCustomPenalidad idContrato={idContrato} show={isOpenCustomPenalidad.isOpen} id={isOpenCustomPenalidad.id} onHide={onCloseModalCustomPenalidad}/>
    </>
  )
}

