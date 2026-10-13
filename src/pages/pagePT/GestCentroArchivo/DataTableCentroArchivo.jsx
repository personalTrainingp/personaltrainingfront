import React, { useEffect } from 'react'
import { useCenterArchive } from './hook/useCenterArchive'
import { useSelector } from 'react-redux'
import config from '@/config'
import { DataTableCR } from '@/components/DataView/DataTableCR'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import dayjs from 'dayjs'

const descargarArchivo = async (row) => {
  const nameImage = row.tb_image?.name_image
  if (!nameImage) return
  const url = `${config.API_IMG.DOC_GENERAL}${nameImage}`
  const ext = nameImage.includes('.') ? nameImage.substring(nameImage.lastIndexOf('.')) : ''
  const titulo = (row.titulo || 'archivo').trim().replace(/[\\/:*?"<>|]+/g, '-')
  const filename = `${titulo} ${dayjs().format('DD-MM-YYYY HH-mm-ss')}${ext}`
  try {
    const resp = await fetch(url)
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    const blobUrl = URL.createObjectURL(await resp.blob())
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(blobUrl)
  } catch (error) {
    console.error('Error al descargar archivo:', error)
    window.open(url, '_blank', 'noopener')
  }
}

export const DataTableCentroArchivo = ({idEmpresa, onClickOpenModalCustomArchivo, data}) => {
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
              <i className='pi pi-file-pdf fs-2 cursor-pointer' onClick={()=>descargarArchivo(row)}></i>
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
        {id: 'Subtipo', accessor: '', header: 'subtipo', render:(row)=>{
          return (
            <>
            {row?.subtipo?.label_param}
            </>
          )
        }},
        {id: 'action', accessor: '', header: '', render: (row)=>{
          return (
            <>
              <Button icon="pi pi-trash" rounded outlined severity="danger"  className='mr-2'
              onClick={()=>confirmDeleteArchivoxID(row.id)} 
              />
              <Button icon="pi pi-pencil" rounded outlined severity="danger"  className='mr-2'
              onClick={()=>editarArchivoxID(row.id)} 
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
    const editarArchivoxID = (id)=>{
      onClickOpenModalCustomArchivo(id)
    }
  return (
    <div>
        <DataTableCR
            columns={columns}
            data={data ?? dataView}
        />
    </div>
  )
}
