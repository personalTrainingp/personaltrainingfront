import React, { useEffect } from 'react'
import { useCenterArchive } from './hook/useCenterArchive'
import { useSelector } from 'react-redux'
import config from '@/config'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { DataTableCR } from '@/components/DataView/DataTableCR'

export const DataTableCentroArchivo = () => {
    const { obtenerArchivosCenter } = useCenterArchive()
    const { dataView } = useSelector(e=>e.DATA)
      const { obtenerParametroPorEntidadyGrupo, DataGeneral } = useTerminoStore()
      const { obtenerParametroPorEntidadyGrupo:obtenerTipoDoc, DataGeneral:datatipoDoc } = useTerminoStore()
    useEffect(() => {
        obtenerParametroPorEntidadyGrupo('files', 'tipo_doc')
        obtenerTipoDoc('centro-archivo','tipo-archivo')
        obtenerArchivosCenter()
    }, [])
    const columns = [
        {id: '', accessor: '', header: 'Id'}
    ]
  return (
    <div>
        <DataTableCR
            columns={columns}
        />
    </div>
  )
}
