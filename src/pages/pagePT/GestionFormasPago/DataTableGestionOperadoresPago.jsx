import React, { useEffect } from 'react'
import { useGestionOperadoresPagoStore } from './useGestionOperadoresPagoStore'
import { DataTableCR } from '@/components/DataView/DataTableCR'
import { useSelector } from 'react-redux'
import { Button } from 'primereact/button'
import { arrayEstadoComercial } from '@/types/type'

export const DataTableGestionOperadoresPago = ({onOpenModalGestionOperadoresPago}) => {
  const { obtenerGestionOperadoresPago, deleteGestionOperadoresPago } = useGestionOperadoresPagoStore()
  const {dataView} = useSelector(e=>e.OPERADORESPAGO)
  useEffect(() => {
    obtenerGestionOperadoresPago()
  }, [])
  const columns = [
    {
      id: 1, header: 'FECHA DE REGISTRO', render:(row)=>{
        return (
          <>
          {row.fecha_ingreso}
          </>
        )
      }
    },
    {
      id: 2, header: 'OPERADOR', render: (row)=>{
        return (
          <>
          {row.OperadorLabel?.label_param}
          </>
        )
      }
    },
    {
      id: 3, header: 'FORMAS DE PAGO', render: (row)=>{
        return (
          <>
          {row.FormaPagoLabel?.label_param}
          </>
        )
      }
    },
    {
      id: 3, header: 'TIPOS DE TARJETA', render: (row)=>{
        const idtipotarjeta = row.TipoTarjetaLabel?.id_param
        return (
          <>
          {
            idtipotarjeta?row.TipoTarjetaLabel?.label_param:'-'
          }
          </>
        )
      }
    },
    {
      id: 4, header: 'MARCAS DE TARJETA', render: (row)=>{
        return (
          <>
          {row.TarjetaLabel?.label_param}
          </>
        )
      }
    },
    {
      id: 4, header: 'BANCOS', render: (row)=>{
        return (
          <>
          {row.BancoLabel?.label_param}
          </>
        )
      }
    },
    {
      id: 5, header: 'CUOTA', render: (row)=>{
        return (
          <>
          {row.cuota}
          </>
        )
      }
    },
    {
      id: 6, header: '% COMISION', render: (row)=>{
        return (
          <>
          {row.porcentaje_comision?.toFixed(2)}
          </>
        )
      }
    },
    {
      id: 10, header: '', render: (row)=>{
        return (
          <>
            <Button icon="pi pi-copy" onClick={()=>onOpenModalOperadoresPago(row.id, true)} rounded outlined severity="danger"  className='mr-2'/>
            <Button icon="pi pi-pencil" onClick={()=>onOpenModalOperadoresPago(row.id, false)} rounded outlined severity="danger"  className='mr-2'/>
            <Button icon="pi pi-trash" rounded outlined severity="danger"  className='mr-2'/>
          </>
        )
      }
    },
  ]
  const onOpenModalOperadoresPago = (id, isCopy=false)=>{
    onOpenModalGestionOperadoresPago(id, isCopy)
  }
  const onDeleteOperadoresPago = ()=>{
    
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
