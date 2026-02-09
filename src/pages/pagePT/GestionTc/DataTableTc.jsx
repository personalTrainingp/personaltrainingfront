import { DataTableCR } from '@/components/DataView/DataTableCR'
import React, { useEffect } from 'react'
import { useTc } from './hook/useTc'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import { useSelector } from 'react-redux'
import { DateMaskStr, DateMaskString } from '@/components/CurrencyMask'

export const DataTableTc = ({onOpenModalTC}) => {
  const { deleteTCxID, obtenerTC } = useTc()
  const { dataView } = useSelector(e=>e.TC)
  useEffect(() => {
    obtenerTC()
  }, [1])
  
  const columns = [
    {id: 1, header: 'ID', render: (row)=>{
      return (
        <>
          {row.id}
        </>
      )
    }},
    {id: 2, header: 'FECHA', render: (row)=>{
      return (
        <>
          {DateMaskStr(row.fecha, 'dddd DD [de] MMMM [del] YYYY')}
        </>
      )
    }},
    {id: 3, header: 'COMPRA', render: (row)=>{
      return (
        <>
          {row.precio_compra.toFixed(3)}
        </>
      )
    }},
    {id: 4, header: 'VENTA', render: (row)=>{
      return (
        <>
          {row.precio_venta.toFixed(3)}
        </>
      )
    }},
    {id: 5, header: '', render:(row)=>{
      return (
        <>
        <Button icon="pi pi-trash" rounded outlined severity="danger"  className='mr-2' onClick={()=>confirmDeleteItem(row.id)}/>
        <Button icon="pi pi-pencil" rounded outlined severity="danger"  className='mr-2' onClick={()=>onOpenModalEditarItem(row.id)}/>
        </>
      )
    }},
  ]
  const confirmDeleteItem = (id)=>{
    confirmDialog({
      message: 'Quieres eliminar este TC',
      accept: ()=>{
        deleteTCxID(id)
      }
    })
  }
  const onOpenModalEditarItem=(id)=>{
    onOpenModalTC(id)
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
