import React, { useEffect } from 'react'
import { useCenterArchive } from './useCenterArchive'
import { useSelector } from 'react-redux'
import config from '@/config'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'

export const DataTable = () => {
    const { obtenerArchivosCenter } = useCenterArchive()
    const { dataView } = useSelector(e=>e.DATA)
      const { obtenerParametroPorEntidadyGrupo, DataGeneral } = useTerminoStore()
      const { obtenerParametroPorEntidadyGrupo:obtenerTipoDoc, DataGeneral:datatipoDoc } = useTerminoStore()
    useEffect(() => {
        obtenerParametroPorEntidadyGrupo('files', 'tipo_doc')
        obtenerTipoDoc('centro-archivo','tipo-archivo')
        obtenerArchivosCenter()
    }, [])
    
  return (
    <div>
        <table className='table'>
            <thead>
                <tr>
                    <th></th>
                    <th>Tipo De archivo</th>
                    <th>TITULO</th>
                    <th>DESCRIPCION</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    dataView.map(d=>{
                        return (
                            <tr>
                                <td> 
                                    <a href={`${config.API_IMG.FILES_COLABORADORES}${d?.tb_image?.name_image}`}>
                                        <i className='pi pi-file-pdf fs-2 cursor-pointer'></i>
                                    </a>
                                </td>
                                <td>{datatipoDoc.find(e=>e.value===d.id_tipo_doc)?.label}</td>
                                <td> {d.titulo} </td>
                                <td> {d.observacion} </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    </div>
  )
}
