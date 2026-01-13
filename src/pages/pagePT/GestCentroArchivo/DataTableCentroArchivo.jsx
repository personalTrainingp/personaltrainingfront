import React, { useEffect } from 'react'
import { useCenterArchive } from './hook/useCenterArchive'
import { useSelector } from 'react-redux'
import config from '@/config'
import { DataTableCR } from '@/components/DataView/DataTableCR'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'

export const DataTableCentroArchivo = ({idEmpresa}) => {
    const { obtenerArchivosCenter, onDeleteArchivo } = useCenterArchive()
    const { dataView } = useSelector(e=>e.DATA)
    useEffect(() => {
      obtenerArchivosCenter(idEmpresa)
    }, [idEmpresa])
    
    const columns = [
        {id: 'id', accessor: 'id', header: 'Id'},
        {id: 'adjunto', header: 'ADJ.', render: (row)=>{
            return (
              <>
              <a href={`${config.API_IMG.DOC_GENERAL}${row.tb_image?.name_image}`}>
                                        <i className='pi pi-file-pdf fs-2 cursor-pointer'></i>
              </a>
              </>
            )
        }},
        {id: 'titulo', accessor: 'titulo', header: 'Titulo'},
        {id: 'observacion', accessor: 'observacion', header: 'Observacion'},
        // {id: 'seccion', accessor: '', header: 'Seccion', render:(row)=>{
        //   return (
        //     <>
        //     {row?.visibles?.label_param}
        //     </>
        //   )
        // }},
        {id: 'tipo', accessor: '', header: 'tipo', render:(row)=>{
          return (
            <>
            {row?.tipo?.label_param}
            </>
          )
        }},
        {id: 'action', accessor: '', header: '', render: (row)=>{
          return (
            <>
                            <Button icon="pi pi-trash" rounded outlined severity="danger"  className='mr-2'
                            onClick={()=>confirmDeleteArchivoxID(row.id)} 
                            />
            </>
          )
        }},
    ]
    const confirmDeleteArchivoxID = (id)=>{
      confirmDialog({
        message: '¿Quieres eliminar este archivo?',
        accept: ()=>{
          onDeleteArchivo(id)
        }
      })
    }
  return (
    <div>
        <DataTableCR
            columns={columns}
            data={dataView}
        />
    </div>
  )
}
