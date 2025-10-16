import React, { useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { useCenterArchive } from './useCenterArchive'
import { useSelector } from 'react-redux'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import config from '@/config'

export const DataTable = ({uid_location}) => {
  const { obtenerArchivCenterxUidLocation } = useCenterArchive()
    const { obtenerParametroPorEntidadyGrupo:obtenerTipoDoc, DataGeneral:datatipoDoc } = useTerminoStore()
  const { dataView } = useSelector(e=>e.DATA)
  useEffect(() => {
    if(uid_location){
      obtenerArchivCenterxUidLocation(uid_location)
          obtenerTipoDoc('centro-archivo','tipo-archivo-doc-colaboradores')
    }
  }, [uid_location])
  return (
    <div>
        <Table>
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th>TIPO</th>
              <th>DESCRIPCION</th>
            </tr>
          </thead>
          <tbody>
            {
              dataView.map((d, index)=>{
                return (
                  <tr>
                    <td>
                      {index+1}
                    </td>
                    <td>
                      <a href={`${config.API_IMG.FILES_COLABORADORES}${d.tb_image?.name_image}`} target='_blank'>
                        <i className='pi pi-file-pdf'></i>
                      </a>
                    </td>
                    <td>
                      {datatipoDoc.find(e=>e.value===d.id_tipo_doc)?.label}
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
    </div>
  )
}
