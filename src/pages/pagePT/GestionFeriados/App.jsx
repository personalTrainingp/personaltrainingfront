import { Button } from 'primereact/button'
import React, { useState } from 'react'
import { DataTableFeriados } from './DataTableFeriados'
import { ModalCustomFeriados } from './ModalCustomFeriados'

export const App = () => {
  const [isOpenModalCustomFeriados, setisOpenModalCustomFeriados] = useState({isOpen: false, id: 0})
  const onOpenModalCustomFeriados = (id)=>{
    setisOpenModalCustomFeriados({isOpen: true, id})
  }
  const onCloseModalCustomFeriados = ()=>{
    setisOpenModalCustomFeriados({isOpen: false, id: 0})
  }
  return (
    <div>
      <Button label='Agregar Feriados' onClick={()=>onOpenModalCustomFeriados(0)}/>
      <DataTableFeriados list={[]}/>
      <ModalCustomFeriados show={isOpenModalCustomFeriados.isOpen} onHide={onCloseModalCustomFeriados}/>
    </div>
  )
}
