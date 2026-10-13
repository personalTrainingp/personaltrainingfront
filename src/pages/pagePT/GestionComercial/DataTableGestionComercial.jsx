import React, { useEffect, useMemo } from 'react'
import { useGestionComercialStore } from './useGestionComercialStore'
import { DataTableCR } from '@/components/DataView/DataTableCR'
import { useSelector } from 'react-redux'
import { Button } from 'primereact/button'
import { arrayEstadoComercial } from '@/types/type'

export const DataTableGestionComercial = ({onOpenModalComentario, onOpenModalGestionComercial, onOpenModalTareas, onOpenModalMembresias, filtroEstado, filtroAsesor}) => {
  const { obtenerGestionComercial } = useGestionComercialStore()
  const {dataView} = useSelector(e=>e.COMERCIAL)
  useEffect(() => {
    obtenerGestionComercial()
  }, [])
  const dataFiltrada = useMemo(() => {
    return dataView?.filter(e=>
      (!filtroEstado || e.parametro_estado?.id_param===filtroEstado) &&
      (!filtroAsesor || (e.id_empl ?? e.empleado?.id_empl)===filtroAsesor)
    )
  }, [dataView, filtroEstado, filtroAsesor])
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
      id: 14, header: 'CLIENTE', render: (row)=>{
        if (!row.id_cli) return <span className='text-muted'>SIN CLIENTE</span>
        return (
          <span className='text-primary text-decoration-underline cursor-pointer' onClick={()=>onOpenModalMembresias(row)}>
            {row.cliente?.nombres_apellidos_cli ?? `CLIENTE ${row.id_cli}`}
          </span>
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
    // {
    //   id: 6, header: 'DISTRITO', render: (row)=>{
    //     return (
    //       <>
    //       </>
    //     )
    //   }
    // },
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
          {[{label: 'CHANGE 45', value: 2}, {label: 'FS 45', value: 3}, {label: 'FISIO MUSCLE', value: 4}].find(e=>e.value===row.id_pgm)?.label}
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
      id: 13, header: 'OBSERVACION', render: (row)=>{
        return (
          <>
          {row.observacion}
          </>
        )
      }
    },
    {
      id: 10, header: '', render: (row)=>{
        return (
          <>
            <Button icon="pi pi-pencil" onClick={()=>onOpenModalGestionComercial(row.id, false, row)} rounded outlined severity="danger"  className='mr-2' tooltip='EDITAR' tooltipOptions={{ position: 'top' }}/>
            <Button icon="pi pi-comment" onClick={()=>onOpenComentario(row.uid_comentario)} rounded outlined severity="danger"  className='mr-2'/>
            {/* <Button icon="pi pi-history" onClick={()=>onOpenComentario(row.uid_comentario)} rounded outlined severity="danger"  className='mr-2'/>
            <Button icon="pi pi-eye" onClick={()=>onOpenComentario(row.uid_comentario)} rounded outlined severity="danger"  className='mr-2'/> */}
            <Button icon="pi pi-list-check" onClick={()=>onOpenModalTareas(row)} rounded outlined severity="danger"  className='mr-2' tooltip='TAREAS' tooltipOptions={{ position: 'top' }}/>
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
          data={dataFiltrada}
          columns={columns}
        />
    </div>
  )
}
