import { Button } from 'primereact/button'
import React, { useEffect, useState } from 'react'
import { DataTableTardanzas } from './DataTableTardanzas'
import { ModalCustomTardanzas } from './ModalCustomTardanzas'
import { PageBreadcrumb } from '@/components'
import { useTardanzasStore } from './useTardanzasStore'
import { useSelector } from 'react-redux'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'

export const App2 = ({id_empresa}) => {
  const [isOpenModalCustomTardanzas, setisOpenModalCustomTardanzas] = useState({isOpen: false, id: 0})
  const { obtenerTardanzas } = useTardanzasStore()
  const {dataView} = useSelector(e=>e.DATA)
      const { DataGeneral:dataTipoTardanzas, obtenerParametroPorEntidadyGrupo:obtenerTipoTardanzas } = useTerminoStore()

  useEffect(() => {
    obtenerTardanzas(id_empresa)
    obtenerTipoTardanzas('rr.hh.', 'tipo-tardanza')
  }, [id_empresa])
  
  const onOpenModalCustomTardanzas = (id)=>{
    setisOpenModalCustomTardanzas({isOpen: true, id})
  }
  const onCloseModalCustomTardanzas = ()=>{
    setisOpenModalCustomTardanzas({isOpen: false, id: 0})
  }
  return (
    <div>
      {/* <pre>
        {
          JSON.stringify(dataView, null, 2)
        }
      </pre> */}
      <PageBreadcrumb title={'Gestion de tardanzas'}/>
      <Button label='Agregar Tardanza' onClick={()=>onOpenModalCustomTardanzas(0)}/>
      <DataTableTardanzas list={dataView} dataTipoTardanzas={dataTipoTardanzas}/>
      <ModalCustomTardanzas id_empresa={id_empresa} show={isOpenModalCustomTardanzas.isOpen} onHide={onCloseModalCustomTardanzas}/>
    </div>
  )
}
