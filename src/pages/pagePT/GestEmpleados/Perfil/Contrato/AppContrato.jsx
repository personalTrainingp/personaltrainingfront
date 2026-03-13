import React, { useState } from 'react'
import { DataTableContratos } from './DataTableContratos'
import { InputButton } from '@/components/InputText'
import { ModalCustomContrato } from './ModalCustomContrato'
import { ModalCustomCalendarioJornadas } from './ModalCustomCalendarioJornadas'
import { useSelector } from 'react-redux'

export const App = ({id_empleado}) => {
  const { dataView } = useSelector(e=>e.CONTRATOEMP)

    const [isOpenModalCustomContrato, setisOpenModalCustomContrato] = useState({isOpen: false, id: 0})
    const [isOpenModalCustomCalendarioJornadas, setisOpenModalCustomCalendarioJornadas] = useState({isOpen: false, id: 0, id_contrato: 0, fechaInicio: new Date(), fechaFin: new Date()})
  const onOpenModalCustomContrato = (id)=>{
    setisOpenModalCustomContrato({isOpen: true})
  }
  const onCloseModalCustomContrato = ()=>{
    setisOpenModalCustomContrato({isOpen: false})
  }

  const onOpenModalCustomCalendarioJornadas = (id_contrato, fechaInicio, fechaFin)=>{
    setisOpenModalCustomCalendarioJornadas({isOpen: true, id: 0, id_contrato, fechaInicio, fechaFin})
  }

  const onCloseModalCustomCalendarioJornadas = ()=>{
    setisOpenModalCustomCalendarioJornadas({isOpen: false, id: 0, id_contrato: 0})
  }

  return (
    <div>
      {JSON.stringify(dataView, null, 2)}
      <div className='mb-2'>
        {
          dataView.find(d=>d.estado==true) ? (<></>): (
            <InputButton label='AGREGAR CONTRATO' onClick={()=>onOpenModalCustomContrato(0)}/>
          )
        }
      </div>
      <DataTableContratos
        id_empleado={id_empleado}
        onOpenModalCustomCalendarioJornadas={onOpenModalCustomCalendarioJornadas}

      />
      <ModalCustomContrato  id_empleado={id_empleado} show={isOpenModalCustomContrato.isOpen} onHide={()=>setisOpenModalCustomContrato({isOpen: false, id: 0})}/>
      <ModalCustomCalendarioJornadas fechaFin={isOpenModalCustomCalendarioJornadas.fechaFin} fechaInicio={isOpenModalCustomCalendarioJornadas.fechaInicio} idContrato={isOpenModalCustomCalendarioJornadas.id_contrato} show={isOpenModalCustomCalendarioJornadas.isOpen} onHide={onCloseModalCustomCalendarioJornadas}/>
    </div>
  )
}
