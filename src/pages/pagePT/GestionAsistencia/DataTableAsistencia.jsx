import { DataTableCR } from '@/components/DataView/DataTableCR'
import React from 'react'

export const DataTableAsistencia = ({list, onOpenModalCustomAsistencia, onOpenModalOfertasAsistencia, onDeleteCustomAsistencia}) => {
    const columns = [
    { id: 'id', header: 'ID', accessor: 'id', sortable: true, width: 20, headerAlign: 'right', cellAlign: 'left' },
    { id: 'nombre', header: 'Nombre', accessor: 'nombre', width: 100, headerAlign: 'right', cellAlign: 'left' },
    { id: 'fecha', header: 'Fecha', accessor: 'fecha', width: 100, headerAlign: 'right', cellAlign: 'left' },
    { id: 'descripcion', header: 'Descripcion', accessor: 'descripcion', sortable: true, width: 70, headerAlign: 'right', cellAlign: 'right' },
    { id: 'Tipo de feriado', header: 'tipo_feriado', accessor: 'tipo_feriado', sortable: true, width: 70, headerAlign: 'right', cellAlign: 'right' },
    { id: 'stock', header: 'Cantidad', accessor: 'stock', sortable: true, width: 70, headerAlign: 'right', cellAlign: 'right' },
  ];
  return (
    <DataTableCR
          columns={columns}
          data={list}
          defaultPageSize={25}
          pageSizeOptions={[10, 25, 50, 100]}
          striped={false}
          small
          responsive
          syncUrl
          pageParam="page"          // opcional (default: "page")
          pageSizeParam="pageSize"  // opcional (default: "pageSize")
          verticalBorders
          resizableColumns
    />
  )
}
