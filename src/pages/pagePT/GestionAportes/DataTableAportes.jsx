import { DataTableCR } from '@/components/DataView/DataTableCR'
import React from 'react'

export const DataTableAportes = ({idEmpresa}) => {
  const columns = [
    { id: 'id', header: 'ID', sortable: true, width: 20, headerAlign: 'right', cellAlign: 'left' },
    { id: 'fechaRegistro', header: 'Fecha registro', width: 100, headerAlign: 'right', cellAlign: 'left' },
    { id: 'proveedor', header: 'Institucion o Aportante', width: 100, headerAlign: 'right', cellAlign: 'left' },
    { id: 'tipo_comprobante', header: 'Tipo de comprobante', width: 100, headerAlign: 'right', cellAlign: 'left' },
    { id: 'monto', header: 'Monto', width: 100, headerAlign: 'right', cellAlign: 'left' },
    { id: 'fechaAporte', header: 'Fecha Aporte', accessor: 'fechaDesde', width: 100, headerAlign: 'right', cellAlign: 'left' },
    { id: 'formaPago', header: 'Forma Pago', accessor: 'fechaDesde', width: 100, headerAlign: 'right', cellAlign: 'left' },
    { id: 'fechaPago', header: 'Fecha Pago', accessor: 'fechaDesde', width: 100, headerAlign: 'right', cellAlign: 'left' },
    { id: 'nOperacion', header: 'N° Operacion', accessor: 'fechaDesde', width: 100, headerAlign: 'right', cellAlign: 'left' },
    { id: 'nComprobante', header: 'N° comprobante', accessor: 'fechaDesde', width: 100, headerAlign: 'right', cellAlign: 'left' },
    { id: '', header: '', render:()=>{
        return (
            <>
            </>
        )
    } },
  ];
  return (
    <div>
        <DataTableCR
            columns={columns}
        />
    </div>
  )
}
