import React, { useEffect, useState } from 'react'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { useContratoColaboradorStore } from './useContratoColaboradorStore'
import { useSelector } from 'react-redux'
import { DataTableCR } from '@/components/DataView/DataTableCR'
import { Button } from 'primereact/button'

export const DataTableContratos = ({id_empleado, onOpenModalCustomCalendarioJornadas }) => {
  const { obtenerContratosxColaborador } = useContratoColaboradorStore()
  const { dataView } = useSelector(e=>e.CONTRATOEMP)

  useEffect(() => {
    obtenerContratosxColaborador(id_empleado)
  }, [id_empleado])
  const columns = [
    {id: 0, header: 'Sueldo', render: (row)=>{
      return (
        <>
        <NumberFormatMoney amount={row.sueldo}/>
        </>
      )
    }},
    {id: 1, header: 'FECHA DE INICIO', render: (row)=>{
      return (
        <>
        {row.fecha_inicio}
        </>
      )
    }},
    {id: 2, header: 'FECHA DE FIN', render: (row)=>{
      return (
        <>
        {row.fecha_fin}
        </>
      )
    }},
    {id: 3, header: 'ACTION', render: (row)=>{
      return (
        <>
          <Button icon="pi pi-trash" rounded outlined/>
          <Button icon="pi pi-calendar" onClick={()=>onOpenModalCalendarioDeJornadas(row.id, row.fecha_inicio, row.fecha_fin)} rounded outlined/>
        </>
      )
    }}
  ]

  const onOpenModalCalendarioDeJornadas = (id, fechaInicio, fechaFin)=>{
    onOpenModalCustomCalendarioJornadas(id, fechaInicio, fechaFin)
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
