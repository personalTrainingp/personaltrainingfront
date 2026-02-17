import { DataTableCR } from '@/components/DataView/DataTableCR'
import React, { useEffect } from 'react'
import { useGestVentasStore } from './useGestVentasStore'

export const DataTableVentas = ({id_empresa}) => {
    const { obtenerVentasxEmpresa, dataVentasxEmpresa } = useGestVentasStore()
      useEffect(() => {
        obtenerVentasxEmpresa(id_empresa)
      }, [id_empresa])
      console.log({dataVentasxEmpresa});
      const columns = [
        {id: 1, header: 'ID', accessor: 'id'},
        {id: 2, header: 'FECHA', render: (row)=>{
            return (
                <>
                {row.fecha_venta}
                </>
            )
        }},
        {id: 3, header: 'SOCIO', render:(row)=>{
            return (
                <>
                {row.tb_cliente?.urlAvatar}
                </>
            )
        }}
      ]
  return (
    <div>
        <DataTableCR 
            data={dataVentasxEmpresa}
            columns={columns}
        />
    </div>
  )
}
