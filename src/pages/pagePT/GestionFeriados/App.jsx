import { Button } from 'primereact/button'
import React, { useState } from 'react'
import { DataTableFeriados } from './DataTableFeriados'
import { ModalCustomFeriados } from './ModalCustomFeriados'
import { PageBreadcrumb } from '@/components'

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
      <PageBreadcrumb title={'Gestion de feriados'}/>
      <Button label='Agregar Feriados' onClick={()=>onOpenModalCustomFeriados(0)}/>
      <DataTableFeriados list={[]}/>
      <ModalCustomFeriados show={isOpenModalCustomFeriados.isOpen} onHide={onCloseModalCustomFeriados}/>
    </div>
  )
}
