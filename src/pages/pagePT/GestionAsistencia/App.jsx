import React, { useState } from 'react'
import { useAsistenciaStore } from './useAsistenciaStore'
import { DataTableAsistencia } from './DataTableAsistencia'
import { Button } from 'primereact/button'
import { PageBreadcrumb } from '@/components'

export const App = () => {
    const { obtenerAsistenciasManualxFecha, postAsistenciaManual } = useAsistenciaStore()
    const [isOpenModalCustomAsistencia, setisOpenModalCustomAsistencia] = useState({isOpen: false, id: 0})
    const onOpenModalCustomAsistencia = (id)=>{
        setisOpenModalCustomAsistencia({isOpen: true, id})
    }
  return (
    <div>
        <PageBreadcrumb title={'ASISTENCIA MANUAL'}/>
        <Button label='AGREGAR ASISTENCIA'/>
        <DataTableAsistencia/>
    </div>
  )
}
