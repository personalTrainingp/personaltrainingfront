import React, { useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { useCenterArchive } from './useCenterArchive'
import { useSelector } from 'react-redux'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import config from '@/config'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'

export const DataTable = ({uid_location, onEditar}) => {
  const { obtenerArchivCenterxUidLocation, onDeleteArchivo } = useCenterArchive()
  const confirmarEliminar = (id)=>{
    confirmDialog({
      header: 'Eliminar documento',
      message: '¿Quieres eliminar este documento?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: ()=>onDeleteArchivo(id, uid_location),
    })
  }
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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              dataView.map((d, index)=>{
                return (
                  <tr key={d.id}>
                    <td>
                      {index+1}
                    </td>
                    <td>
                      <a href={`${config.API_IMG.FILES_COLABORADORES}${encodeURIComponent(d.tb_image?.name_image ?? '')}`} target='_blank' rel='noreferrer' title={d.tb_image?.name_image}>
                        <i className={/\.(jpe?g|png|gif|webp)$/i.test(d.tb_image?.name_image ?? '') ? 'pi pi-image' : /\.pdf$/i.test(d.tb_image?.name_image ?? '') ? 'pi pi-file-pdf' : 'pi pi-file'}></i>
                      </a>
                    </td>
                    <td>
                      {datatipoDoc.find(e=>e.value===d.id_tipo_doc)?.label}
                    </td>
                    <td>
                      {d.observacion}
                    </td>
                    <td className='text-nowrap'>
                      <Button label='EDITAR' size='small' outlined className='me-2' onClick={()=>onEditar(d)}/>
                      <Button label='ELIMINAR' size='small' outlined severity='danger' onClick={()=>confirmarEliminar(d.id)}/>
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
