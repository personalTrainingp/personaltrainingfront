import React, { useEffect } from 'react'
import { useGestionComercialStore } from './useGestionComercialStore'
import { DataTableCR } from '@/components/DataView/DataTableCR'
import { useSelector } from 'react-redux'
import { Button } from 'primereact/button'
import { arrayEstadoComercial } from '@/types/type'

export const DataTableGestionComercial = ({onOpenModalComentario}) => {
  const { obtenerGestionComercial } = useGestionComercialStore()
  const {dataView} = useSelector(e=>e.COMERCIAL)
  useEffect(() => {
    obtenerGestionComercial()
  }, [])
  const columns = [
    {
      id: 1, header: 'FECHA DE REGISTRO', render:(row)=>{
        return (
          <>
          {row.fecha_registro}
          </>
        )
      }
    },
    {
      id: 2, header: 'ASESOR', render: (row)=>{
        return (
          <>
          {row.empleado?.nombres_apellidos_empl}
          </>
        )
      }
    },
    {
      id: 3, header: 'NOMBRES', render: (row)=>{
        return (
          <>
          {row.nombres}
          </>
        )
      }
    },
    {
      id: 4 , header: 'APELLIDOS', render: (row)=>{
        return (
          <>
          {row.apellidos}
          </>
        )
      }
    },
    {
      id: 5, header: 'CELULAR', render: (row)=>{
        return (
          <>
          {row.celular}
          </>
        )
      }
    },
    {
      id: 6, header: 'DISTRITO', render: (row)=>{
        return (
          <>
          </>
        )
      }
    },
    {
      id: 7, header: 'CANAL', render: (row)=>{
        return (
          <>
          {row.parametro_canal?.label_param}
          </>
        )
      }
    },
    {
      id: 12, header: 'MEDIO DE COMUNICACION', render: (row)=>{
        return (
          <>

          {row.parametro_medio_comunicacion?.label_param}
          </>
        )
      }
    },
    {
      id: 8, header: 'PROGRAMAS', render: (row)=>{
        return (
          <>
          </>
        )
      }
    },
    {
      id: 9, header: 'ESTATUS', render: (row)=>{
        return (
          <>
          <Button className={`${arrayEstadoComercial.find(e=>e.value===row.parametro_estado?.id_param)?.color} border-none`} label={row.parametro_estado?.label_param}/>
          </>
        )
      }
    },
    {
      id: 10, header: '', render: (row)=>{
        return (
          <>
            <Button icon="pi pi-comment" onClick={()=>onOpenComentario(row.uid_comentario)} rounded outlined severity="danger"  className='mr-2'/>
            <Button icon="pi pi-history" onClick={()=>onOpenComentario(row.uid_comentario)} rounded outlined severity="danger"  className='mr-2'/>
            <Button icon="pi pi-eye" onClick={()=>onOpenComentario(row.uid_comentario)} rounded outlined severity="danger"  className='mr-2'/>
          </>
        )
      }
    },
  ]
  const onOpenComentario = (uid)=>{
    onOpenModalComentario(uid)
  }
  
  return (
    <div>
      <DataTableCR
          data={dataView}
          columns={columns}
        />
    </div>
  )
}
