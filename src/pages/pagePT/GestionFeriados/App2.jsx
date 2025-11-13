import { Button } from 'primereact/button'
import React, { useEffect, useState } from 'react'
import { DataTableFeriados } from './DataTableFeriados'
import { ModalCustomFeriados } from './ModalCustomFeriados'
import { PageBreadcrumb } from '@/components'
import { useSelector } from 'react-redux'
import { useFeriadosStore } from './useFeriadosStore'

export const App2 = ({id_empresa}) => {
  const [isOpenModalCustomFeriados, setisOpenModalCustomFeriados] = useState({isOpen: false, id: 0})
    const { obtenerFeriados } = useFeriadosStore()

  const {dataView} = useSelector(e=>e.DATA)
  const onOpenModalCustomFeriados = (id)=>{
    setisOpenModalCustomFeriados({isOpen: true, id})
  }
  const onCloseModalCustomFeriados = ()=>{
    setisOpenModalCustomFeriados({isOpen: false, id: 0})
  }
  
    useEffect(() => {
      obtenerFeriados(id_empresa)
    }, [id_empresa])
  return (
    <div>
      <PageBreadcrumb title={'Gestion de feriados'}/>
      <Button label='Agregar Feriados' onClick={()=>onOpenModalCustomFeriados(0)}/>
      <DataTableFeriados list={dataView}/>
      <ModalCustomFeriados id_empresa={id_empresa} show={isOpenModalCustomFeriados.isOpen} onHide={onCloseModalCustomFeriados}/>
    </div>
  )
}
